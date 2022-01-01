import UserDoesNotExist from '@components/Modules/404/UserDoesNotExist';
import { useGetUserInfoQuery } from '@graphql/user.graphql';
import UrlPrefix from '@lib/functions/UrlPrefix';
import React from 'react';
import { Layout } from '.';

type UserLayoutProps = { username: string };

const UserLayout: React.FC<UserLayoutProps> = ({ username, children }) => {
  const { data, loading, error, refetch } = useGetUserInfoQuery({
    variables: { username: username },
  });

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;

  if (data === undefined) return <UserDoesNotExist />;

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

export default UserLayout;
