import UserLayout from '@components/Layouts/User';
import UserDoesNotExist from '@components/Modules/404/UserDoesNotExist';
import { useUserQuery } from '@graphql/user.graphql';
import { NextPageContext } from 'next';
import React from 'react';

import { LoginContext } from '../../_app';

const UserMapPage: React.FC<{ username: string }> = ({ username }) => {
  // login context
  const loginContext = React.useContext(LoginContext);

  const { data, loading, error, refetch } = useUserQuery({
    variables: { username: username },
  });

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;

  if (data === undefined || data.user === undefined)
    return <UserDoesNotExist />;

  return <UserLayout userQuery={data} currentTab="map"></UserLayout>;
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

export default UserMapPage;
