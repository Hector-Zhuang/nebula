import { definePageConfig, resolvePageConfig } from '../src/pageConfig';

describe('definePageConfig', () => {
  it('returns the config object unchanged', () => {
    const config = {
      route: 'pages/home',
      navigationBarTitleText: 'Home',
      navigationStyle: 'custom' as const,
    };

    expect(definePageConfig(config)).toBe(config);
  });

  it('accepts an empty config', () => {
    expect(definePageConfig({})).toEqual({});
  });
});

describe('resolvePageConfig', () => {
  it('applies defaults when the config is missing', () => {
    expect(resolvePageConfig()).toEqual({
      navigationStyle: 'default',
      visualEffectInBackground: 'none',
    });
    expect(resolvePageConfig(null)).toEqual(resolvePageConfig());
  });

  it('applies defaults when the config is not a plain object', () => {
    expect(resolvePageConfig('pages/home' as never)).toEqual(
      resolvePageConfig(),
    );
  });

  it('merges the config over the defaults', () => {
    expect(
      resolvePageConfig({
        navigationBarTitleText: 'Home',
        navigationStyle: 'custom',
        visualEffectInBackground: 'blur',
      }),
    ).toEqual({
      navigationBarTitleText: 'Home',
      navigationStyle: 'custom',
      visualEffectInBackground: 'blur',
    });
  });

  it('strips the manifest-only route key', () => {
    expect(resolvePageConfig({ route: 'pages/home' })).toEqual({
      navigationStyle: 'default',
      visualEffectInBackground: 'none',
    });
  });

  it('treats explicitly undefined fields as unset', () => {
    expect(resolvePageConfig({ navigationStyle: undefined })).toEqual(
      resolvePageConfig(),
    );
  });
});
