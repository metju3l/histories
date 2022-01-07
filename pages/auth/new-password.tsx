import AuthLayout from '@components/Layouts/Auth';
import NewPasswordTemplate from '@components/Templates/Auth/NewPassword';
import { SSRRedirect } from '@lib/functions';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { validate } from 'uuid';

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

// get token from url query and validate it
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const token = ctx.query.token; // get token from url query

  if (typeof token !== 'string') return SSRRedirect('/'); // validate token type
  if (!validate(token)) return SSRRedirect('/'); // validate UUID

  return { props: { token } }; // return token in props
}

export default NewPassword;
