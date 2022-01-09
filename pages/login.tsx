import AuthLayout from '@components/Layouts/Auth';
import LoginTemplate from '@components/Templates/Auth/Login';
import { RedirectLogged } from '@lib/functions/ServerSideProps';
import React from 'react';

const Login: React.FC = () => {
  return (
    <AuthLayout
      head={{
        title: `Log in | HiStories`,
        description: `Log in to your HiStories account`,
        canonical: 'https://www.histories.cc/login',
        openGraph: {
          title: `Log in | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/login',
          description: `Log in to your HiStories account`,
          site_name: 'Log in page',
        },
      }}
    >
      <LoginTemplate />
    </AuthLayout>
  );
};

export const getServerSideProps = RedirectLogged;


export default Login;
