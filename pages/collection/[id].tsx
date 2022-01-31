import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { Layout } from '@components/Layouts';
import {
  CollectionDocument,
  CollectionQuery,
} from '@graphql/collection.graphql';
import {
  GetCookieFromServerSideProps,
  IsJwtValid,
  SSRRedirect,
} from '@lib/functions';
import { GetServerSidePropsContext } from 'next';
import React from 'react';

import { Maybe } from '../../.cache/__types__';

const CheckPost: React.FC<{
  collection: {
    name: string;
    description?: Maybe<string>;
    createdAt: number;
    postCount: number;
    id: number;
    author: {
      firstName: string;
      lastName: string;
      bio: string;
      profile: string
    };
  };
}> = ({ collection }) => {
  return (
    <Layout
      head={{
        title: `${collection.name} | Histories`,
        description:
          collection.description ??
          `${collection.author.firstName}'s collection`,
        canonical: `https://www.histories.cc/collection/${collection.id}`,
        openGraph: {
          title: `Collection | Histories`,
          type: 'website',
          url: `https://www.histories.cc/collection/${collection.id}`,
          description:
            collection.description ??
            `${collection.author.firstName}'s collection`,
          site_name: 'Collection',
        },
      }}
    >
      <div>
        {collection.description}
      </div>
      <div>{JSON.stringify(collection)}</div>
    </Layout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query, req } = ctx;
  if (typeof query.id !== 'string') return { props: { id: null } };
  const jwt = GetCookieFromServerSideProps(req.headers.cookie, 'jwt');
  const anonymous = jwt === null ? true : IsJwtValid(jwt);

  // create new apollo graphql client
  const client = new ApolloClient({
    link: createHttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
        'http://localhost:3000/api/graphql',
      headers: {
        authorization: jwt ? `Bearer ${jwt}` : '',
      },
    }),

    cache: new InMemoryCache(),
  });

  // fetch user query
  if (!req.url?.startsWith('_next')) {
    try {
      const { data }: { data: CollectionQuery } = await client.query({
        query: CollectionDocument,
        variables: { id: parseInt(query.id) },
      });
      // return props
      return {
        props: {
          collection: data.collection,
          anonymous,
        },
      };
    } catch (e) {
      return SSRRedirect('/404?error=collection_does_not_exist');
    }
  }
  // this should not be needed 🤷‍♀️
  return {
    props: {},
  };
};

export default CheckPost;
