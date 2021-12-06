import '../lib/translation/i18n';
import 'tailwindcss/tailwind.css';
import './app.scss';

import { ApolloProvider } from '@apollo/client';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import NextNprogress from 'nextjs-progressbar';
import React, { createContext } from 'react';

import { useApollo } from '../lib/apollo';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const apolloClient = useApollo(null);

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider attribute="class">
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
        />
        <NextNprogress
          color="#8B5CF6"
          height={2}
          options={{ showSpinner: false }}
          showOnShallow
        />
        <LoginProvider>
          <Component {...pageProps} />
        </LoginProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

const LoginProvider: React.FC = ({ children }) => {
  const logged = useIsLoggedQuery();
  const LoginContext = createContext(logged);

  return (
    <LoginContext.Provider value={logged}>{children}</LoginContext.Provider>
  );
};

export default MyApp;
