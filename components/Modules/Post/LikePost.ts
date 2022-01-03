import { toast } from 'react-hot-toast';

export type LikePostProps = {
  type: string;
  refetch: () => Promise<void>;
  localLikeState: string | null;
  setLocalLikeState: React.Dispatch<React.SetStateAction<string | null>>;

  localLikeCount: number;
  setLocalLikeCount: React.Dispatch<React.SetStateAction<number>>;
  id: number;
  likeMutation: any;
};

const LikePost = async ({
  type,
  likeMutation,
  refetch,
  localLikeState,
  setLocalLikeState,
  setLocalLikeCount,
  localLikeCount,
  id,
}: LikePostProps): Promise<void> => {
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
};

export default LikePost;
