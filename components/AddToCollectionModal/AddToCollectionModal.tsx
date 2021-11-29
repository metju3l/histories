import { LoginContext } from '@components/Layout';
import { useAddToCollectionMutation } from '@graphql/relations.graphql';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { toast } from 'react-hot-toast';

export type AddToCollectionModalProps = {
  postId: number;
  isOpen: boolean;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  postId,
  isOpen,
  setOpenState,
}) => {
  const loginContext = React.useContext(LoginContext);
  const [addToCollectionMutation] = useAddToCollectionMutation();

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: 'easeOut', duration: 0.2 }}
          className="fixed inset-0 z-10 flex items-center overflow-y-hidden bg-black bg-opacity-10"
          onClick={() => setOpenState(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ ease: 'easeInOut', duration: 0.2 }}
            className="absolute bottom-0 z-40 flex flex-col w-full overflow-hidden bg-white border shadow-2xl lg:m-auto lg:relative lg:max-w-4xl rounded-t-[2rem] lg:rounded-[2rem] max-h-[65vh] border-light-background-tertiary"
          >
            <div className="flex items-center justify-between p-6">
              <div className="text-lg font-semibold">Save to</div>
              <button onClick={() => setOpenState(false)}>close</button>
            </div>
            <div className="overflow-x-hidden overflow-y-auto grid grid-cols-3 gap-4">
              {loginContext.data?.isLogged?.collections?.map((collection) => (
                <div
                  key={collection?.name}
                  onClick={async () => {
                    try {
                      toast.success(
                        'Post saved to ' + collection?.name ?? 'collection'
                      );
                      await addToCollectionMutation({
                        variables: {
                          postId,
                          collectionId: collection!.id,
                        },
                      });
                      setOpenState(false);
                    } catch (error: any) {
                      toast.error(error.message);
                    }
                  }}
                  className="text-center"
                >
                  <div className="w-full h-20 w-3/4 m-auto bg-gray-300 hover:bg-gray-400 rounded-xl"></div>
                  {collection?.name}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default AddToCollectionModal;
