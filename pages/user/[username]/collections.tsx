import 'react-dropdown/style.css';

import CreateCollectionModal from '@components/Collection/CreateCollectionModal';
import { useGetUserInfoQuery, useMeQuery } from '@graphql/user.graphql';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';

const Collections: FC<{ username: string }> = ({ username }) => {
  const router = useRouter();
  const { data, loading, error, refetch } = useGetUserInfoQuery({
    variables: { username: username },
  });
  const logged = useMeQuery();
  const [createModal, setCreateModal] = useState(false);
  const sortOptions = [
    { value: 'hot', label: 'Hot' },
    { value: 'mostliked', label: 'Most liked' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ];

  if (error) {
    return <div>error...</div>;
  }
  if (loading || logged.loading) return <div>loading</div>;
  if (logged.error) {
    console.log(logged.error);
    return <div>error</div>;
  }
  if (data === null || data === undefined)
    return <div>user does not exist</div>;
  const isLogged = logged.data!.me;

  return (
    <>
      <CreateCollectionModal
        openState={createModal}
        setOpenState={setCreateModal}
        refetch={refetch}
      />
    </>
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

export default Collections;
