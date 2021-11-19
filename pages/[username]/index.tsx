import { AccountCreatedCard, PostCard } from '@components/PostCard';
import { ProfilePage } from '@components/ProfilePage';
import { useGetUserInfoQuery, useIsLoggedQuery } from '@graphql/user.graphql';
import { NextPageContext } from 'next';
import Link from 'next/link';
import React from 'react';

const User: React.FC<{ username: string }> = ({ username }) => {
  const { data, loading, error, refetch } = useGetUserInfoQuery({
    variables: { username: username },
  });
  const logged = useIsLoggedQuery();

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
  if (data === null || data === undefined)
    return <div>user does not exist</div>;

  return (
    <ProfilePage
      title={`${data.user.username} | hiStories`}
      username={data.user.username}
      rightColumn={
        <>
          {data.user.posts &&
            data.user.posts.map((post: any) => (
              <PostCard key={post!.id} id={post!.id} isLoggedQuery={logged} />
            ))}
          <AccountCreatedCard
            date={data.user.createdAt}
            firstName={data.user.firstName}
          />
        </>
      }
      menu={
        <>
          {' '}
          <Link href={'/' + data.user.username} passHref>
            <button className="px-6 py-2 text-gray-200 bg-[#484A4D] rounded-xl">
              Posts
            </button>
          </Link>
          <Link href={'/' + data.user.username + '/collections'} passHref>
            <button className="px-6 py-2 text-gray-200 hover:bg-[#484A4D] rounded-xl">
              Collections
            </button>
          </Link>
          <Link href={'/' + data.user.username + '/map'} passHref>
            <button className="px-6 py-2 text-gray-200 hover:bg-[#484A4D] rounded-xl">
              Map
            </button>
          </Link>
          {logged.data?.isLogged?.id === data.user.id && (
            <Link href={'/settings'} passHref>
              <button className="px-6 py-2 text-gray-200 hover:bg-[#484A4D] rounded-xl">
                Settings
              </button>
            </Link>
          )}
        </>
      }
    />
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
