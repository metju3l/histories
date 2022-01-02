import UserLayout from '@components/Layouts/User';
import { NextPageContext } from 'next';
import React from 'react';

const PostsPage: React.FC<{ username: string }> = ({ username }) => {
  return <UserLayout username={username} currentTab="posts"></UserLayout>;
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

export default PostsPage;
