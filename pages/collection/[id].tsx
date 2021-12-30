import 'react-dropdown/style.css';

import { useCollectionQuery } from '@graphql/collection.graphql';
import { useMeQuery } from '@graphql/user.graphql';
import { NextPageContext } from 'next';
import React, { FC } from 'react';

const Collections: FC<{ id: number }> = ({ id }) => {
  const { data, loading, error } = useCollectionQuery({ variables: { id } });
  const logged = useMeQuery();

  const sortOptions = [
    { value: 'hot', label: 'Hot' },
    { value: 'mostliked', label: 'Most liked' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ];

  if (loading || logged.loading) return <div>loading</div>;
  if (error || data === undefined) return <div>error</div>;

  return (
    <>
      <div></div>
    </>
  );
};

export const getServerSideProps = async (
  context: NextPageContext
): Promise<{
  props: {
    id: number;
  };
}> => {
  return {
    props: {
      // @ts-ignore
      id: parseInt(context.query.id),
    },
  };
};

export default Collections;
