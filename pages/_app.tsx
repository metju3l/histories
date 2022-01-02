import '../lib/translation/i18n';
import '../lib/styles/main.css';

import { ApolloError, ApolloProvider, ApolloQueryResult } from '@apollo/client';
import { MeQuery, useMeQuery } from '@graphql/user.graphql';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import NextNprogress from 'nextjs-progressbar';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useApollo } from '../lib/utils/apollo';
import { orange_main } from '../shared/config/colors';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const apolloClient = useApollo(null);

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
        />
        <script
          // this is here just because there is no better alternative and I don't agree with it
          // I still don't like microsoft
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_MS_CLARITY}");`,
          }}
        />
        <NextNprogress
          color={orange_main}
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

export type LoginContextType = {
  data: MeQuery | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: (() => Promise<ApolloQueryResult<MeQuery>>) | undefined;
};

export const LoginContext = React.createContext<LoginContextType>({
  data: undefined,
  loading: true,
  error: undefined,
  refetch: undefined,
});

const LoginProvider: React.FC = ({ children }) => {
  const { data, loading, error, refetch } = useMeQuery();
  const { i18n } = useTranslation();

  useEffect(() => {
    // on load get browser language
    i18n.changeLanguage(navigator.language);
  }, []);

  // todo: use language from database

  return (
    <LoginContext.Provider value={{ data, loading, error, refetch }}>
      {children}
    </LoginContext.Provider>
  );
};

export default MyApp;
