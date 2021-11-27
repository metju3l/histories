import { Layout, LoginContext } from '@components/Layout';
import Suggestions from '@components/MainPage/RightColumn/Suggestions';
import { Post } from '@components/Post';
import { PostCard } from '@components/PostCard';
import { usePersonalizedPostsQuery, usePostQuery } from '@graphql/post.graphql';
import { useLikeMutation, useUnlikeMutation } from '@graphql/relations.graphql';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

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
          <PersonalizedPosts />
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

const PersonalizedPosts = () => {
  const { data, loading, error, refetch } = usePersonalizedPostsQuery();

  if (loading) return <div>post loading</div>;
  if (error) return <div>post error</div>;

  return (
    <div>
      {data?.personalizedPosts.map((post: any) => (
        <PostController {...post} key={post.id} />
      ))}
    </div>
  );
};

const PostController: React.FC<{
  id: number;
  description: string;
  photos: Array<{ url: string }>;
}> = ({ id, description, photos }) => {
  const loginContext = React.useContext(LoginContext);

  const [localLikeState, setLocalLikeState] = useState<string | undefined>(
    undefined
  );
  const [likeMutation] = useLikeMutation();
  const [unlikeMutation] = useUnlikeMutation();

  const { data, loading, error, refetch } = usePostQuery({ variables: { id } });

  if (loading) return <div>post loading</div>;
  if (error) return <div>post error</div>;

  return (
    <Post
      author={{ ...data!.post.author }}
      createdAt={data!.post.createdAt}
      postDate={data!.post.postDate}
      description={description}
      likeCount={22}
      commentCount={18}
      photos={data?.post.url?.map((url: string) => ({ url }))}
      timeline
      liked={localLikeState}
      loginContext={loginContext}
      onLike={async (type) => {
        if (loginContext.data?.isLogged?.id)
          try {
            setLocalLikeState(type);
            await likeMutation({ variables: { id, type } });
          } catch (error: any) {
            toast.error(error.message);
          }
      }}
      onUnlike={async () => {
        if (loginContext.data?.isLogged?.id)
          try {
            setLocalLikeState(undefined);
            await unlikeMutation({ variables: { id } });
          } catch (error: any) {
            toast.error(error.message);
          }
      }}
    />
  );
};

export default Index;
