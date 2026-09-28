import { definePageConfig } from '../src/pageConfig';

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
