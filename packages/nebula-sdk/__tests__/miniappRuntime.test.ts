/**
 * Behavioral tests for the miniapp-side runtime (public Miniapp API).
 * The native boundary (./nebulaNative) is mocked because the React Native
 * TurboModule does not exist outside a device.
 */
jest.mock('../src/nebulaNative', () => {
  const listeners = new Map<string, Set<(event: unknown) => void>>();

  const nativeModule = {
    navigateTo: jest.fn(),
    redirectTo: jest.fn(),
    reLaunch: jest.fn(),
    navigateBack: jest.fn(),
    setPageStyle: jest.fn(),
    showToast: jest.fn(),
    postMessageToHost: jest.fn(),
    bringHostToFront: jest.fn(),
    restoreMiniApp: jest.fn(),
    presentHostModal: jest.fn(),
    dismissHostModal: jest.fn(),
    getDeviceInfo: jest.fn(),
  };

  return {
    __esModule: true,
    NEBULA_MINI_APP_MESSAGE_EVENT: 'NebulaMiniAppMessage',
    NEBULA_PAGE_LIFECYCLE_EVENT: 'NebulaPageLifecycle',
    getNebulaNativeModule: () => nativeModule,
    isProtocolResponse: (message: Record<string, unknown>) =>
      message.__nebulaProtocol === 'api.v1' &&
      typeof message.kind === 'string' &&
      typeof message.requestId === 'string',
    addNebulaEventListener: (
      eventName: string,
      listener: (event: unknown) => void,
    ) => {
      const set = listeners.get(eventName) ?? new Set();
      set.add(listener);
      listeners.set(eventName, set);
      return () => {
        set.delete(listener);
      };
    },
    __emit(eventName: string, event: unknown) {
      listeners.get(eventName)?.forEach(listener => listener(event));
    },
    __listeners: listeners,
    __nativeModule: nativeModule,
  };
});

import { Miniapp, compareCapabilityVersions } from '../src/miniappRuntime';
import {
  getNebulaNativeModule,
  __emit,
  __nativeModule,
} from '../src/nebulaNative';

const flush = () => new Promise(resolve => setImmediate(resolve));

const respondToLastHostMessage = (response: Record<string, unknown>) => {
  const call = __nativeModule.postMessageToHost.mock.calls.at(-1);
  const message = call?.[1] as { requestId: string } | undefined;
  if (!message) {
    throw new Error('expected a host message to have been posted');
  }
  __emit('NebulaMiniAppMessage', {
    appId: 'host',
    message: { ...response, requestId: message.requestId },
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  __nativeModule.postMessageToHost.mockResolvedValue({});
});

describe('compareCapabilityVersions', () => {
  it('compares dotted numeric versions segment by segment', () => {
    expect(compareCapabilityVersions('1.2.3', '1.2.3')).toBe(0);
    expect(compareCapabilityVersions('1.3.0', '1.2.9')).toBe(1);
    expect(compareCapabilityVersions('2.0.0', '10.0.0')).toBe(-1);
  });

  it('treats missing and non-numeric segments as zero', () => {
    expect(compareCapabilityVersions('1.2', '1.2.0')).toBe(0);
    expect(compareCapabilityVersions('1.x.0', '1.0.0')).toBe(0);
  });
});

describe('Miniapp bootstrap identity', () => {
  it('records the app id and derives the sandbox path', () => {
    Miniapp.bootstrap('miniapp-123');
    expect(Miniapp.getAppId()).toBe('miniapp-123');
    expect(Miniapp.getSandboxPath()).toBe('/Documents/MiniApps/miniapp-123');
  });

  it('ignores empty and null bootstrap ids', () => {
    Miniapp.bootstrap('persisted-id');
    Miniapp.bootstrap('');
    expect(Miniapp.getAppId()).toBe('persisted-id');
    Miniapp.bootstrap(null);
    expect(Miniapp.getAppId()).toBe('persisted-id');
  });
});

describe('Miniapp navigation delegation', () => {
  it('forwards the current app id to the native module', async () => {
    Miniapp.bootstrap('nav-app');
    jest
      .mocked(getNebulaNativeModule().navigateTo)
      .mockResolvedValue({ success: true });

    await Miniapp.navigateTo('/pages/detail?id=1');

    expect(__nativeModule.navigateTo).toHaveBeenCalledWith(
      'nav-app',
      '/pages/detail?id=1',
    );
  });
});

describe('Miniapp.isSupported', () => {
  const capabilitiesResponse = (
    capabilities: Record<string, unknown>,
  ): void => {
    respondToLastHostMessage({
      __nebulaProtocol: 'api.v1',
      kind: 'capabilities',
      data: { bridgeVersion: '1.0.0', capabilities },
    });
  };

  it('resolves false for an api absent from capabilities', async () => {
    const promise = Miniapp.isSupported('missingApi');
    await flush();
    capabilitiesResponse({});
    await expect(promise).resolves.toBe(false);
  });

  it('resolves false when the host reports the api unsupported', async () => {
    const promise = Miniapp.isSupported('scanCode');
    await flush();
    capabilitiesResponse({
      scanCode: { version: '1.0.0', supported: false },
    });
    await expect(promise).resolves.toBe(false);
  });

  it('resolves true without a minimum version when supported', async () => {
    const promise = Miniapp.isSupported('scanCode');
    await flush();
    capabilitiesResponse({
      scanCode: { version: '1.0.0', supported: true },
    });
    await expect(promise).resolves.toBe(true);
  });

  it('enforces the minimum version against the host capability version', async () => {
    const cases: Array<[string, string, boolean]> = [
      ['1.3.0', '1.2.0', false],
      ['1.2.0', '1.2.0', true],
      ['1.0.0', '2.0.0', true],
    ];

    for (const [minimum, hostVersion, expected] of cases) {
      const promise = Miniapp.isSupported('scanCode', minimum);
      await flush();
      capabilitiesResponse({
        scanCode: { version: hostVersion, supported: true },
      });
      expect(await promise).toBe(expected);
    }
  });
});

describe('Miniapp.invokeHostApi', () => {
  it('rejects with a timeout error when the host never responds', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await expect(
      Miniapp.invokeHostApi('hangingApi', {}, '1.0.0', 50),
    ).rejects.toThrow('Timed out waiting for host API: hangingApi');
    warnSpy.mockRestore();
  });

  it('resolves with the host invoke result', async () => {
    const promise = Miniapp.invokeHostApi('echo');
    await flush();
    respondToLastHostMessage({
      __nebulaProtocol: 'api.v1',
      kind: 'invokeResult',
      result: { ok: true, data: { echoed: true } },
    });

    await expect(promise).resolves.toEqual({
      ok: true,
      data: { echoed: true },
    });
  });
});

describe('Miniapp.onHostMessage', () => {
  it('returns an unsubscribe that detaches the listener', () => {
    const listener = jest.fn();
    const unsubscribe = Miniapp.onHostMessage(listener);
    const event = { appId: 'a', message: { hello: true } };

    __emit('NebulaMiniAppMessage', event);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    __emit('NebulaMiniAppMessage', event);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
