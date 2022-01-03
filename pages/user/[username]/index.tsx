import { ApolloClient, InMemoryCache, QueryResult } from '@apollo/client';
import UserLayout from '@components/Layouts/User';
import { Post } from '@components/Modules/Post';
import {
  PostsDocument,
  PostsQuery,
} from '@graphql/post.graphql';
import { UserDocument } from '@graphql/user.graphql';
import {
  GetCookieFromServerSideProps,
  IsJwtValid,
  SSRRedirect,
} from '@lib/functions';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import UrlPrefix from 'shared/config/UrlPrefix';

import { Exact, InputMaybe, PostsInput } from '../../../.cache/__types__';
import { ValidateUsername } from '../../../shared/validation';

const PostsPage: React.FC<{
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
}> = ({ user, posts, anonymous }) => {
  return (
    <UserLayout
      user={user}
      currentTab="posts"
      head={{
        title: `${user.firstName} ${user.lastName} | hiStories`,
        description: `${user.firstName} ${user.lastName}'s profile on HiStories`,
        canonical: 'https://www.histories.cc/user/krystofex',
        openGraph: {
          title: `${user.firstName} ${user.lastName} | HiStories`,
          type: 'website',
          images: [
            {
              url: user.profile.startsWith('http')
                ? user.profile
                : UrlPrefix + user.profile,
              width: 92,
              height: 92,
              alt: `${user.firstName} ${user.lastName}'s profile picture`,
            },
          ],
          url: 'https://www.histories.cc/user/krystofex',
          description: `${user.firstName} ${user.lastName}'s profile`,
          site_name: 'Profil page',
          profile: user,
        },
      }}
    >
      <div className="w-full">
        {posts.loading ? (
          <div>loading posts</div>
        ) : (
          <InfiniteScroll
            dataLength={posts.data!.posts.length} //This is important field to render the next data
            next={() => {
              posts.fetchMore({
                variables: {
                  input: {
                    filter: {
                      authorUsername: user.username,
                      skip: posts.data!.posts.length,
                      take: 10,
                    },
                  },
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                  return {
                    ...previousResult,
                    posts: [
                      ...previousResult.posts,
                      ...(fetchMoreResult?.posts ?? []),
                    ],
                  };
                },
              });
            }}
            hasMore={(posts.data?.posts.length ?? 1) % 10 === 0}
            loader={
              <p style={{ textAlign: 'center' }}>
                <b>loading</b>
              </p>
            }
            refreshFunction={async () => {
              await posts.refetch();
            }}
          >
            {posts.data?.posts.map((post: any) => (
              <Post
                timeline
                {...post}
                key={post.id}
                refetch={posts.refetch}
                photos={post.url.map((x: string) => ({ url: x }))}
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </UserLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const jwt = GetCookieFromServerSideProps(req.headers.cookie, 'jwt');
  const anonymous = jwt === null ? true : IsJwtValid(jwt);

  // create new apollo graphql client
  const client = new ApolloClient({
    uri: 'http://localhost:3000/api/graphql', // process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
  });

  // fetch user query
  if (!req.url?.startsWith('_next') && ctx.query.username != 'manifest.json') {
    // check if username is valid, if not redirect to 404 page with argument
    if (typeof ctx.query.username !== 'string')
      return SSRRedirect('/404?error=user_does_not_exist');

    const validateUsername = ValidateUsername(ctx.query.username).error;
    if (validateUsername) return SSRRedirect('/404?error=user_does_not_exist');

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
  }
  return {
    // @ts-ignore
    // this should not be needed 🤷‍♀️
    props: { user: { username: ctx.query.username }, anonymous },
  };
};

export default PostsPage;
