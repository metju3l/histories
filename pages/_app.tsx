import type { AppProps } from 'next/app';
import '../src/translation/i18n';
import 'tailwindcss/tailwind.css';

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apollo';

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(null);

  return (
    <ApolloProvider client={apolloClient}>
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places`}
      ></script>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
export default MyApp;
