import type { Metadata } from 'next';
import { Inter, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { PwaBoot } from '@/components/shared/PwaBoot';
import { messages, normalizeLocale } from '@/i18n/config';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  title: 'Vexaro - High Performance',
  description: 'Manage both cognitive load and capital with tranquil authority.',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const locale = normalizeLocale(cookieStore.get('vexaro_locale')?.value);
  const theme = cookieStore.get('vexaro_theme')?.value === 'dark' ? 'dark' : 'light';

  return (
    <html lang={locale} className={theme} suppressHydrationWarning>
      <body className={`${inter.variable} ${hanken.variable} ${jetbrains.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages[locale]}>
          <PwaBoot />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
