import { ApolloClient, InMemoryCache, QueryResult } from '@apollo/client';
import UserLayout from '@components/Layouts/User';
import Card from '@components/Modules/UserPage/Card';
import { CollectionsIcon, PlusIcon } from '@components/icons';
import { PostsDocument, PostsQuery } from '@graphql/post.graphql';
import { UserDocument } from '@graphql/user.graphql';
import {
  GetCookieFromServerSideProps,
  IsJwtValid,
  SSRRedirect,
} from '@lib/functions';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import React from 'react';

import { Exact, InputMaybe, PostsInput } from '../../../.cache/__types__';
import { ValidateUsername } from '../../../shared/validation';

const CollectionsPage: React.FC<{
  user: {
    username: string;
    firstName: string;
    lastName: string;
    profile: string;
  };
  posts: QueryResult<
    PostsQuery,
    Exact<{
      input?: InputMaybe<PostsInput> | undefined;
    }>
  >;
  anonymous: boolean;
}> = ({ user }) => {
  return (
    <UserLayout
      user={user}
      currentTab="collections"
      head={{
        title: '',
        description: '',
        canonical: undefined,
        // @ts-ignore
        openGraph: undefined,
      }}
    >
      <div className="flex justify-end w-full">
        <Link href="/create/post" passHref>
          <button className="flex items-center px-3 py-1 text-xs font-semibold text-gray-500 border border-gray-500 rounded-full gap-2 space-x-1.5 shadown-sm w-max">
            <PlusIcon className="w-2 h-2" /> Create collection
          </button>
        </Link>
      </div>
      <Card>
        <CollectionsIcon className="w-8 h-8" />
        <div>{`${user.firstName} has not any public collections`}</div>
      </Card>
    </UserLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const jwt = GetCookieFromServerSideProps(req.headers.cookie, 'jwt');
  const anonymous = jwt === null ? true : IsJwtValid(jwt);

  // create new apollo graphql client
  const client = new ApolloClient({
    uri:
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
      'http://localhost:3000/api/graphql',
    cache: new InMemoryCache(),
  });

  // fetch user query
  if (!req.url?.startsWith('_next')) {
    // check if username is valid, if not redirect to 404 page with argument
    if (typeof ctx.query.username !== 'string')
      return SSRRedirect('/404?error=user_does_not_exist');

    const validateUsername = ValidateUsername(ctx.query.username).error;
    if (validateUsername) return SSRRedirect('/404?error=user_does_not_exist');

    try {
      const { data: userData } = await client.query({
        query: UserDocument,
        variables: { username: ctx.query.username },
      });

      const postsQuery = await client.query({
        query: PostsDocument,
        variables: {
          input: {
            filter: {
              authorUsername: ctx.query.username,
              skip: 0,
              take: 10,
            },
          },
        },
      });

      // return props
      return {
        props: {
          user: userData.user,
          posts: postsQuery,
          anonymous,
        },
      };
    } catch (e) {
      return SSRRedirect('/404?error=user_does_not_exist');
    }
  }
  return {
    // @ts-ignore
    // this should not be needed 🤷‍♀️
    props: { user: { username: ctx.query.username }, anonymous },
  };
};

export default CollectionsPage;
