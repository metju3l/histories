import { Layout } from '@components/Layout';
import Suggestions from '@components/MainPage/RightColumn/Suggestions';
import { PostCard } from '@components/PostCard';
import { usePersonalizedPostsQuery } from '@graphql/post.graphql';
import { useCheckIfLoggedQuery, useIsLoggedQuery } from '@graphql/user.graphql';
import React from 'react';

const Index: React.FC = () => {
  const logged = useIsLoggedQuery();

  if (logged.loading) return <div>logged loading</div>;
  if (logged.error) {
    console.log(logged.error);
    return <div>logged error</div>;
  }

  return (
    <Layout title="hiStories">
      <div className="flex m-auto max-w-screen-xl">
        <div className="hidden w-[30%] p-[1em] xl:block">
          <div className="sticky top-20"></div>
        </div>
        <div className="w-full mt-2 xl:w-[40%] md:w-[60%] p-[1em]">
          <PersonalizedPosts logged={logged} />
        </div>
        {/* RIGHT COLUMN */}
        <div className="hidden w-[40%] xl:w-[30%] p-[1em] md:block">
          <div className="sticky top-20">
            <div className="w-full mb-8 rounded-lg p-[1em] text-text-light">
              <Suggestions logged={logged.data} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const PersonalizedPosts = ({ logged }: { logged: any }) => {
  const { data, loading, error, refetch } = usePersonalizedPostsQuery();

  if (loading) return <div>post loading</div>;
  if (error) return <div>post error</div>;

  return (
    <div>
      {data?.personalizedPosts.map((post: any) => (
        <PostCard key={post.id} id={post.id} isLoggedQuery={logged} />
      ))}
    </div>
  );
};

export default Index;
