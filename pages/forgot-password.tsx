import AuthLayout from '@components/Layouts/Auth';
import ForgotPasswordTemplate from '@components/Templates/Auth/ForgotPassword';
import { RedirectLogged } from '@lib/functions/ServerSideProps';
import React from 'react';

const ForgotPassword: React.FC = () => {
  return (
    <AuthLayout
      head={{
        title: `Forgot password | HiStories`,
        description: `Forgot password`,
        canonical: 'https://www.histories.cc/forgot-password',
        openGraph: {
          title: `Forgot password | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/forgot-password',
          description: `Forgot password`,
          site_name: 'Forgot password',
        },
      }}
    >
      <ForgotPasswordTemplate />
    </AuthLayout>
  );
};

export const getServerSideProps = RedirectLogged;


export default ForgotPassword;
