import type { AppProps } from 'next/app';
import '../lib/translation/i18n';
import 'tailwindcss/tailwind.css';

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apollo';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const apolloClient = useApollo(null);

  return (
    <ApolloProvider client={apolloClient}>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
      />
      <Toaster position="top-center" reverseOrder={true} />

      <Component {...pageProps} />
    </ApolloProvider>
  );
}
export default MyApp;
