import { AccountCreatedCard, PostCard } from '@components/PostCard';
import { ProfilePage } from '@components/ProfilePage';
import { useGetUserInfoQuery, useIsLoggedQuery } from '@graphql/user.graphql';
import { NextPageContext } from 'next';
import React from 'react';

const User: React.FC<{ username: string }> = ({ username }) => {
  const { data, loading, error } = useGetUserInfoQuery({
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
