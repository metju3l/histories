import AuthLayout from '@components/Layouts/Auth';
import LoginTemplate from '@components/Templates/Login';
import React, { FC } from 'react';

const Login: FC = () => {
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

export default Login;
