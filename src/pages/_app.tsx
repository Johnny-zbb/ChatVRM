import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@charcoal-ui/icons";
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '@/i18n/locales/en.json';
import zhMessages from '@/i18n/locales/zh.json';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const messages = {
  en: enMessages,
  zh: zhMessages,
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const savedLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'en';
    setLocale(savedLocale);
  }, []);

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale as keyof typeof messages] || messages.en}>
      <Component {...pageProps} />
    </NextIntlClientProvider>
  );
}