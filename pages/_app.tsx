import '../lib/translation/i18n';
import '../lib/styles/main.scss';

import { ApolloProvider } from '@apollo/client';
import { useMeQuery } from '@graphql/user.graphql';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import NextNprogress from 'nextjs-progressbar';
import React, { createContext } from 'react';

import { useApollo } from '../lib/utils/apollo';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const apolloClient = useApollo(null);

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider attribute="class">
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
          color="#000"
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
  const logged = useMeQuery();
  const LoginContext = createContext(logged);

  return (
    <LoginContext.Provider value={logged}>{children}</LoginContext.Provider>
  );
};

export default MyApp;
