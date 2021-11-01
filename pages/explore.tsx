import React from 'react';
import { useCheckIfLoggedQuery, useIsLoggedQuery } from '@graphql/user.graphql';
import Suggestions from '@components/MainPage/RightColumn/Suggestions';
import { usePersonalizedPostsQuery, usePostQuery } from '@graphql/post.graphql';
import { Layout } from '@components/Layout';
import Image from 'next/image';

const Explore: React.FC = () => {
  const { data, loading, error, refetch } = usePersonalizedPostsQuery();

  if (loading) return <div>post loading</div>;
  if (error) return <div>post error</div>;

  console.log(data?.personalizedPosts);

  return (
    <Layout title="hiStories">
      <div className="grid grid-cols-3 gap-2 max-w-screen-xl m-auto mt-4">
        {data?.personalizedPosts.map((post, index) => (
          <PostCard key={post!.id} id={post!.id} index={index} />
        ))}
      </div>
    </Layout>
  );
};

const PostCard: React.FC<{ id: number; index: number }> = ({ id, index }) => {
  const { data, loading, error } = usePostQuery({ variables: { id } });

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;

  console.log(data);

  return (
    <div
      className={`relative w-full  ${
        index === 1 ? 'col-span-2 row-span-2 h-[40rem]' : 'h-80'
      }`}
    >
      <Image
        src={data!.post.url[0]}
        layout="fill"
        alt="image"
        objectFit="cover"
      />
    </div>
  );
};

export default Explore;
