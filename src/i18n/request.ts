import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { messages, normalizeLocale } from './config';

export default getRequestConfig(() => {
  const locale = normalizeLocale(cookies().get('vexaro_locale')?.value);

  return {
    locale,
    messages: messages[locale],
  };
});
