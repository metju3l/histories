import { LoginContext } from '@components/Layouts';
import { Modal } from '@components/Modules/tmp/Modal';
import { useAddToCollectionMutation } from '@graphql/relations.graphql';
import React from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Modal title="Save to" isOpen={isOpen} setOpenState={setOpenState}>
      <div className="px-4 mb-5 overflow-x-hidden overflow-y-auto grid grid-cols-3 gap-4">
        {loginContext.data?.me?.collections?.map((collection) => (
          <div
            key={collection?.name}
            onClick={async () => {
              try {
                toast.success(
                  t('post_saved_to') + ' ' + collection?.name ?? t('collection')
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
            <div className="w-full h-20 m-auto bg-gray-300 hover:bg-gray-400 rounded-xl"></div>
            {collection?.name}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default AddToCollectionModal;
