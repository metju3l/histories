import AuthLayout from '@components/Layouts/Auth';
import RegisterTemplate from '@components/Templates/Register';
import React from 'react';

const Register: React.FC = () => {
  return (
    <AuthLayout
      head={{
        title: `Sign up | HiStories`,
        description: `Create new HiStories account`,
        canonical: 'https://www.histories.cc/register',
        openGraph: {
          title: `Sign up | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/register',
          description: `Create new HiStories account`,
          site_name: 'Sign up page',
        },
      }}
    >
      <RegisterTemplate />
    </AuthLayout>
  );
};

export default Register;
