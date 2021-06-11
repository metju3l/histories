import type { AppProps } from 'next/app';
import '../src/translation/i18n';
import 'tailwindcss/tailwind.css';

import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default MyApp;
