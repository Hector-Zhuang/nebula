import {
  createHostApiFailure,
  createHostApiSuccess,
  createHostModalChannel,
} from '../src/hostApi';
import type { NebulaApiInvokeResult } from '../src/nebulaTypes';

describe('host API result factories', () => {
  it('creates a success result carrying data', () => {
    expect(createHostApiSuccess({ value: 42 })).toEqual({
      ok: true,
      data: { value: 42 },
    });
  });

  it('creates a failure result carrying code and message', () => {
    expect(createHostApiFailure('USER_CANCEL', 'cancelled')).toEqual({
      ok: false,
      error: { code: 'USER_CANCEL', message: 'cancelled' },
    });
  });
});

describe('createHostModalChannel', () => {
  type PickRequest = { id: string; resolve?: unknown };

  it('starts empty and immediately delivers the current value to a new subscriber', () => {
    const channel = createHostModalChannel<PickRequest>();
    const received: Array<PickRequest | null> = [];

    expect(channel.getCurrent()).toBeNull();

    const unsubscribe = channel.subscribe(request => {
      received.push(request);
    });

    expect(received).toEqual([null]);

    unsubscribe();
  });

  it('notifies subscribers and exposes the pending request while open', async () => {
    const channel = createHostModalChannel<PickRequest>();
    const received: Array<PickRequest | null> = [];
    channel.subscribe(request => {
      received.push(request);
    });

    let settled: NebulaApiInvokeResult | undefined;
    const openPromise = channel.open({ id: 'req-1' });
    openPromise.then(result => {
      settled = result;
    });

    expect(channel.getCurrent()).toMatchObject({ id: 'req-1' });
    expect(typeof channel.getCurrent()?.resolve).toBe('function');

    channel.settle(createHostApiSuccess({ picked: true }));
    await openPromise;

    expect(settled).toEqual({ ok: true, data: { picked: true } });
    expect(channel.getCurrent()).toBeNull();
    // null (subscribe) -> request (open) -> null (settle)
    expect(received).toHaveLength(3);
    expect(received[0]).toBeNull();
    expect(received[1]).toMatchObject({ id: 'req-1' });
    expect(typeof (received[1] as PickRequest).resolve).toBe('function');
    expect(received[2]).toBeNull();
  });

  it('clear() empties the pending request without resolving it', async () => {
    const channel = createHostModalChannel<PickRequest>();
    const received: Array<PickRequest | null> = [];
    channel.subscribe(request => {
      received.push(request);
    });

    const openPromise = channel.open({ id: 'req-2' });
    let settled = false;
    openPromise.then(() => {
      settled = true;
    });

    channel.clear();

    expect(channel.getCurrent()).toBeNull();
    expect(received.at(-1)).toBeNull();

    await Promise.resolve();
    expect(settled).toBe(false);
  });

  it('stops notifying a subscriber after unsubscribe', async () => {
    const channel = createHostModalChannel<PickRequest>();
    const received: Array<PickRequest | null> = [];
    const unsubscribe = channel.subscribe(request => {
      received.push(request);
    });

    unsubscribe();
    const openPromise = channel.open({ id: 'req-3' });
    channel.settle(createHostApiFailure('X', 'y'));
    await openPromise;

    expect(received).toEqual([null]);
  });
});
