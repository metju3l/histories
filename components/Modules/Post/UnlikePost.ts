import { toast } from 'react-hot-toast';

export type UnlikePostProps = {
  refetch: () => Promise<void>;
  localLikeState: string | null;
  setLocalLikeState: React.Dispatch<React.SetStateAction<string | null>>;
  localLikeCount: number;
  setLocalLikeCount: React.Dispatch<React.SetStateAction<number>>;
  id: number;
  unlikeMutation: any;
};

const UnlikePost = async ({
  unlikeMutation,
  refetch,
  localLikeState,
  setLocalLikeState,
  setLocalLikeCount,
  localLikeCount,
  id,
}: UnlikePostProps): Promise<void> => {
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
};

export default UnlikePost;
