import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { appName } from '@/lib/shared';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: `${appName} — Run Miniapps with React Native`,
    template: `%s · ${appName}`,
  },
  description:
    'A React Native-powered solution for running mini-apps, with host runtime, isolated containers, preloading, and extensible base-library APIs.',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">{children}</body>
    </html>
  );
}
