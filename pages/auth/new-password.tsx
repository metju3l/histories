import AuthLayout from '@components/Layouts/Auth';
import NewPasswordTemplate from '@components/Templates/Auth/NewPassword';
import { RedirectInvalidToken } from '@lib/functions/ServerSideProps';
import React from 'react';

const NewPassword: React.FC<{ token: string }> = ({ token }) => {
  return (
    <AuthLayout
      head={{
        title: `New password | HiStories`,
        description: `New password`,
        canonical: 'https://www.histories.cc/auth/new-password',
        openGraph: {
          title: `New password | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/auth/new-password',
          description: `New password`,
          site_name: 'New password',
        },
      }}
    >
      <NewPasswordTemplate token={token} />
    </AuthLayout>
  );
};

export const getServerSideProps = RedirectInvalidToken

export default NewPassword;
