/**
 * Jest setup that runs after the test framework is installed.
 *
 * The SDK warns at module-load time when the native Nebula module is absent.
 * Under unit tests that path is expected (the native boundary is mocked), so
 * filter just that message while keeping every other warning visible.
 */
const originalWarn = console.warn;
jest.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('[Nebula] NebulaNativeModule not found')
  ) {
    return;
  }
  originalWarn(...(args as [unknown?]));
});
