import { i18n } from '@/lib/i18n';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';
import { NebulaLogo } from '@/components/nebula-logo';

export const i18nUI = defineI18nUI(i18n, {
  en: {
    displayName: 'English',
  },
  zh: {
    displayName: '简体中文',
    search: '搜索文档',
  },
  // ar: {
  //   displayName: 'العربية',
  //   search: 'ابحث في المستندات',
  // },
});

export function baseOptions(_locale?: string): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: <NebulaLogo />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
