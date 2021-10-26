import React from 'react';
import { useCheckIfLoggedQuery, useIsLoggedQuery } from '@graphql/user.graphql';
import { Navbar } from '@components/Navbar';
import Menu from '@components/MainPage/LeftColumn/Menu';
import Suggestions from '@components/MainPage/RightColumn/Suggestions';
import { usePersonalizedPostsQuery } from '@graphql/post.graphql';
import { PostCard } from '@components/PostCard';
import { Layout } from '@components/Layout';

const Index: React.FC = () => {
  const logged = useIsLoggedQuery();

  if (logged.loading) return <div>logged loading</div>;
  if (logged.error) {
    console.log(logged.error);
    return <div>logged error</div>;
  }

  return (
    <Layout title="hiStories">
      <div className="flex max-w-screen-xl m-auto">
        <div className="w-[30%] p-[1em] hidden xl:block">
          <div className="sticky top-20">
            <Menu data={logged.data} />
          </div>
        </div>
        <div className="xl:w-[40%] md:w-[60%] w-full p-[1em] mt-2">
          <PersonalizedPosts logged={logged} />
        </div>
        {/* RIGHT COLUMN */}
        <div className="w-[40%] xl:w-[30%] p-[1em] hidden md:block">
          <div className="sticky top-20">
            <div className="w-full p-[1em] bg-white shadow-lg dark:bg-[#343233] rounded-xl text-text-light dark:text-white mb-8 ">
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
