/**
 * End-to-end behavior of the host-side API protocol, exercised through the
 * public NebulaAPI surface: register features (as a host app does in
 * NebulaAPI.wrap), send protocol requests as if they came from a miniapp,
 * and observe the replies posted back to the miniapp.
 */
jest.mock('../src/nebulaNative', () => {
  const listeners = new Map<string, Set<(event: unknown) => void>>();

  const nativeModule = {
    postMessageToMiniApp: jest.fn().mockResolvedValue({ errMsg: 'ok' }),
  };

  return {
    __esModule: true,
    NEBULA_HOST_MESSAGE_EVENT: 'NebulaHostMessage',
    getNebulaNativeModule: () => nativeModule,
    isProtocolRequest: (message: Record<string, unknown>) =>
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
    __reset() {
      listeners.clear();
    },
    __nativeModule: nativeModule,
  };
});

import { NebulaAPI } from '../src/NebulaAPI';
import { createHostApiFeature, createMockHostApiFeature } from '../src/hostApi';
import { __emit, __nativeModule } from '../src/nebulaNative';

const flush = () => new Promise(resolve => setImmediate(resolve));

let requestSeq = 0;
const nextRequestId = () => `req-${(requestSeq += 1)}`;

const sendRequest = (message: Record<string, unknown>) => {
  __emit('NebulaHostMessage', {
    appId: 'miniapp-1',
    message: {
      __nebulaProtocol: 'api.v1',
      requestId: nextRequestId(),
      ...message,
    },
  });
};

const lastReply = () => {
  const call = __nativeModule.postMessageToMiniApp.mock.calls.at(-1);
  if (!call) {
    throw new Error('expected the host to post a reply');
  }
  return {
    appId: call[0] as string,
    response: call[1] as Record<string, unknown>,
  };
};

const register = (feature: ReturnType<typeof createMockHostApiFeature>) => {
  const unregister = feature.register();
  return () => {
    if (typeof unregister === 'function') {
      unregister();
    }
  };
};

beforeAll(() => {
  // registerApiHandler starts the protocol server once.
  NebulaAPI.registerApiHandler('__bootstrap__', {
    version: '1.0.0',
    handle: async () => ({ ok: true, data: null }),
  });
});

afterAll(() => {
  NebulaAPI.stopApiServer();
});

beforeEach(() => {
  jest.clearAllMocks();
  __nativeModule.postMessageToMiniApp.mockResolvedValue({ errMsg: 'ok' });
});

afterEach(() => {
  NebulaAPI.unregisterApiHandler('__bootstrap__');
  NebulaAPI.unregisterApiHandler('echo');
  NebulaAPI.unregisterApiHandler('failing');
  NebulaAPI.unregisterApiHandler('boom');
  NebulaAPI.unregisterApiHandler('locked');
  NebulaAPI.unregisterApiHandler('legacy');
  // Re-register the bootstrap handler so the server stays usable across tests.
  NebulaAPI.registerApiHandler('__bootstrap__', {
    version: '1.0.0',
    handle: async () => ({ ok: true, data: null }),
  });
});

describe('invoke protocol', () => {
  it('replies UNSUPPORTED_API for an unregistered api', async () => {
    sendRequest({ kind: 'invoke', api: 'doesNotExist', payload: {} });
    await flush();

    const { appId, response } = lastReply();
    expect(appId).toBe('miniapp-1');
    expect(response).toMatchObject({
      __nebulaProtocol: 'api.v1',
      kind: 'invokeResult',
      result: {
        ok: false,
        error: { code: 'UNSUPPORTED_API' },
      },
    });
  });

  it('invokes a registered mock feature and returns its data', async () => {
    const cleanup = register(
      createMockHostApiFeature({
        apiName: 'echo',
        version: '1.2.0',
        result: (payload: Record<string, unknown>) => ({ got: payload.value }),
      }),
    );

    sendRequest({
      kind: 'invoke',
      api: 'echo',
      version: '1.2.0',
      payload: { value: 42 },
    });
    await flush();

    expect(lastReply().response).toMatchObject({
      kind: 'invokeResult',
      result: { ok: true, data: { got: 42 } },
    });
    cleanup();
  });

  it('returns the mock feature error when configured', async () => {
    const cleanup = register(
      createMockHostApiFeature({
        apiName: 'failing',
        error: { code: 'DENIED', message: 'not allowed' },
      }),
    );

    sendRequest({ kind: 'invoke', api: 'failing', payload: {} });
    await flush();

    expect(lastReply().response).toMatchObject({
      kind: 'invokeResult',
      result: {
        ok: false,
        error: { code: 'DENIED', message: 'not allowed' },
      },
    });
    cleanup();
  });

  it('maps a throwing handler to INTERNAL_ERROR without crashing the server', async () => {
    const cleanup = register(
      createHostApiFeature({
        apiName: 'boom',
        handle: async () => {
          throw new Error('handler exploded');
        },
      }),
    );

    sendRequest({ kind: 'invoke', api: 'boom', payload: {} });
    await flush();

    expect(lastReply().response).toMatchObject({
      kind: 'invokeResult',
      result: {
        ok: false,
        error: { code: 'INTERNAL_ERROR', message: 'handler exploded' },
      },
    });

    // The server must still process later requests.
    sendRequest({ kind: 'invoke', api: 'alsoMissing', payload: {} });
    await flush();
    expect(lastReply().response).toMatchObject({
      result: { ok: false, error: { code: 'UNSUPPORTED_API' } },
    });
    cleanup();
  });

  it('replies UNSUPPORTED_API when the handler reports supported=false', async () => {
    const cleanup = register(
      createHostApiFeature({
        apiName: 'locked',
        supported: () => false,
        handle: async () => ({ ok: true, data: null }),
      }),
    );

    sendRequest({ kind: 'invoke', api: 'locked', payload: {} });
    await flush();

    expect(lastReply().response).toMatchObject({
      result: { ok: false, error: { code: 'UNSUPPORTED_API' } },
    });
    cleanup();
  });
});

describe('capabilities protocol', () => {
  it('reports versions and resolved supported flags', async () => {
    const cleanup1 = register(
      createMockHostApiFeature({ apiName: 'echo', version: '1.2.0' }),
    );
    const cleanup2 = register(
      createHostApiFeature({
        apiName: 'legacy',
        version: '0.9.0',
        supported: async () => false,
      }),
    );

    sendRequest({ kind: 'getCapabilities' });
    await flush();

    expect(lastReply().response).toMatchObject({
      kind: 'capabilities',
      data: {
        bridgeVersion: '1.0.0',
        capabilities: {
          echo: { version: '1.2.0', supported: true },
          legacy: { version: '0.9.0', supported: false },
        },
      },
    });
    cleanup1();
    cleanup2();
  });

  it('exposes only handlers that declare a description', async () => {
    const cleanup = register(
      createHostApiFeature({
        apiName: 'echo',
        version: '1.0.0',
        description: {
          summary: 'Echoes payloads',
        },
      }),
    );
    const cleanupNoDesc = register(
      createMockHostApiFeature({ apiName: 'legacy', version: '0.9.0' }),
    );

    sendRequest({ kind: 'getApiDescriptions' });
    await flush();

    const data = lastReply().response.data as Record<string, unknown>;
    expect(data).toHaveProperty('echo');
    expect(data).not.toHaveProperty('legacy');
    cleanup();
    cleanupNoDesc();
  });
});
