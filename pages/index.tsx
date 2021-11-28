import { Layout, LoginContext } from '@components/Layout';
import Suggestions from '@components/MainPage/RightColumn/Suggestions';
import { Post } from '@components/Post';
import { usePersonalizedPostsQuery } from '@graphql/post.graphql';
import { useLikeMutation, useUnlikeMutation } from '@graphql/relations.graphql';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import React, { useContext, useEffect, useState } from 'react';
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
  const { data, loading, error, refetch } = usePersonalizedPostsQuery({
    variables: { skip: 0, take: 100 },
  });

  if (loading) return <div>post loading</div>;
  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <div>
      {data?.personalizedPosts.map((post: any) => (
        <PostController
          {...post}
          key={post.id}
          refetch={refetch}
          photos={post.url.map((x: string) => ({ url: x }))}
        />
      ))}
    </div>
  );
};

const PostController: React.FC<{
  id: number;
  description: string;
  photos: Array<{ url: string }>;
  author: {
    firstName: string;
    lastName: string;
    username: string;
    profileUrl: string;
  };
  createdAt: number;
  commentCount: number;
  likeCount: number;
  liked: string | null;
  postDate: number;
  refetch: () => void;
}> = ({
  id,
  description,
  photos,
  createdAt,
  postDate,
  author,
  commentCount,
  likeCount,
  liked,
  refetch,
}) => {
  const loginContext = useContext(LoginContext);

  // using local states to avoid refetching and provide faster response for user
  const [localLikeState, setLocalLikeState] = useState<string | null>(liked);
  const [localLikeCount, setLocalLikeCount] = useState<number>(likeCount);

  // like and unlike mutations
  const [likeMutation] = useLikeMutation();
  const [unlikeMutation] = useUnlikeMutation();

  // on refetch reset local states to value from graphql query
  useEffect(() => {
    setLocalLikeCount(likeCount);
  }, [likeCount]);

  useEffect(() => {
    setLocalLikeCount(likeCount);
  }, [likeCount]);

  return (
    <Post
      author={author}
      createdAt={createdAt}
      postDate={postDate}
      description={description}
      likeCount={localLikeCount}
      commentCount={commentCount}
      photos={photos}
      timeline
      liked={localLikeState}
      loginContext={loginContext}
      onLike={async (type) => {
        // allow only when user is logged in
        if (loginContext.data?.isLogged?.id)
          // try
          try {
            // if user didn't like post before set localLikeCount + 1
            if (localLikeState === null) setLocalLikeCount(localLikeCount + 1);

            // change localLikeState
            setLocalLikeState(type);

            // call graphql mutation
            await likeMutation({ variables: { id, type } });

            // refetch if there are problems with localStates (isn't expected)
            // await refetch();
          } catch (error: any) {
            // throw error if mutation wasn't successful
            toast.error(error.message);

            // refetch data
            // (localStates will have wrong value)
            // (possibility that post was deleted)
            await refetch();
          }
      }}
      onUnlike={async () => {
        // allow only when user is logged in
        if (loginContext.data?.isLogged?.id)
          // try
          try {
            // if user liked post before set localLikeCount - 1
            if (localLikeState !== null) setLocalLikeCount(localLikeCount - 1);

            // set localLikeState to null
            setLocalLikeState(null);

            // call graphql mutation
            await unlikeMutation({ variables: { id } });

            // refetch if there are problems with localStates (isn't expected)
            // await refetch();
          } catch (error: any) {
            // throw error if mutation wasn't successful
            toast.error(error.message);

            // refetch data
            // (localStates will have wrong value)
            // (possibility that post was deleted)
            await refetch();
          }
      }}
    />
  );
};

export default Index;
