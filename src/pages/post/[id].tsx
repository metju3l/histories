import PostDetail from '@components/templates/PostDetail';
import { NextPageContext } from 'next';
import React from 'react';

import { Maybe } from '../../../.cache/__types__';

const CheckPost: React.FC<{ id: Maybe<number> }> = ({ id }) => {
  if (id === null) return <div>Post doesn{"'"}t exist</div>;
  else return <PostDetail id={id} />;
};

export async function getServerSideProps(context: NextPageContext) {
  if (typeof context.query.id !== 'string') return { props: { id: null } };

  return {
    props: {
      id: parseFloat(context.query.id),
    },
  };
}

export default CheckPost;
