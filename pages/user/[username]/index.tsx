import UserLayout from '@components/Layouts/User';
import UserDoesNotExist from '@components/Modules/404/UserDoesNotExist';
import { Post } from '@components/Modules/Post';
import { usePostsQuery } from '@graphql/post.graphql';
import { useUserQuery } from '@graphql/user.graphql';
import { NextPageContext } from 'next';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const PostsPage: React.FC<{ username: string }> = ({ username }) => {
  const { data, loading, error, refetch } = useUserQuery({
    variables: { username: username },
  });
  const posts = usePostsQuery({
    variables: {
      input: {
        filter: {
          authorUsername: username,
          skip: 0,
          take: 10,
        },
      },
    },
  });

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;

  if (data === undefined || data.user === undefined)
    return <UserDoesNotExist />;

  return (
    <UserLayout userQuery={data} currentTab="posts">
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
                      authorUsername: username,
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
              await refetch();
            }}
          >
            {posts.data?.posts.map((post: any) => (
              <Post
                timeline
                {...post}
                key={post.id}
                refetch={refetch}
                photos={post.url.map((x: string) => ({ url: x }))}
              />
            ))}
            {posts.data?.posts.map((post: any) => (
              <Post
                timeline
                {...post}
                key={post.id}
                refetch={refetch}
                photos={post.url.map((x: string) => ({ url: x }))}
              />
            ))}
            {posts.data?.posts.map((post: any) => (
              <Post
                timeline
                {...post}
                key={post.id}
                refetch={refetch}
                photos={post.url.map((x: string) => ({ url: x }))}
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </UserLayout>
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

export default PostsPage;
