import { Layout } from '@components/Layout';
import { useGetUserInfoQuery, useMeQuery } from '@graphql/user.graphql';
import UrlPrefix from '@lib/functions/UrlPrefix';
import { NextPageContext } from 'next';
import React from 'react';

import Error404 from '../../404';

const User: React.FC<{ username: string }> = ({ username }) => {
  const { data, loading, error, refetch } = useGetUserInfoQuery({
    variables: { username: username },
  });
  const logged = useMeQuery();

  if (error) {
    console.log(error);
    return <div>error...</div>;
  }
  if (loading) return <div>loading</div>;
  if (logged.loading) return <div>loading</div>;
  if (logged.error) {
    console.log(logged.error);
    return <div>error</div>;
  }
  if (data === null || data === undefined) return <Error404 />;

  return (
    <Layout
      head={{
        title: `${data.user.username} | hiStories`,
        description: `${data.user.username}'s profile on HiStories`,
        canonical: 'https://www.histories.cc/user/krystofex',
        openGraph: {
          title: `${data.user.username} | HiStories`,
          type: 'website',
          images: [
            {
              url: UrlPrefix + data.user.profile,
              width: 92,
              height: 92,
              alt: `${data.user.username}'s profile picture`,
            },
          ],
          url: 'https://www.histories.cc/user/krystofex',
          description: `${data.user.username}'s profile`,
          site_name: 'Profil page',
          profile: data.user,
        },
      }}
    >
      <img src={UrlPrefix + data.user.profile} />
    </Layout>
  );
};

export const getServerSideProps = async (
  context: NextPageContext
): Promise<{
  props: {
    username: string;
  };
}> => {
  return {
    props: {
      // @ts-ignore
      username: context.query.username.toString(),
    },
  };
};

export default User;
