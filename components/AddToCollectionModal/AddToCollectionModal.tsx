import { LoginContext } from '@components/Layout/Layout';
import { useAddToCollectionMutation } from '@graphql/relations.graphql';
import { Dialog, Transition } from '@headlessui/react';
import React from 'react';
import { toast } from 'react-hot-toast';

const AddToCollectionModal: React.FC<{
  postId: number;
  openState: boolean;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ postId, openState, setOpenState }) => {
  const loginContext = React.useContext(LoginContext);

  const [addToCollection] = useAddToCollectionMutation();

  if (loginContext.loading) return <div>loading</div>;
  if (loginContext.error) return <div>error</div>;

  return (
    <Transition appear show={openState} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => setOpenState(false)}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white shadow-xl transition-all transform rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium text-gray-900 leading-6"
              >
                Save to
              </Dialog.Title>
              <div className="mt-2">
                {loginContext.data?.isLogged?.collections?.map((collection) => (
                  <button
                    className="w-full px-3 py-2 my-1 bg-gray-300 hover:bg-gray-400 rounded-xl"
                    key={collection?.name}
                    onClick={async () => {
                      try {
                        await addToCollection({
                          variables: {
                            collectionId: collection!.id,
                            postId,
                          },
                        });
                        toast.success(
                          'Post saved to ' + collection?.name ?? 'collection'
                        );
                        setOpenState(false);
                      } catch (error: any) {
                        toast.error(error.message);
                      }
                    }}
                  >
                    {collection?.name}
                  </button>
                ))}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddToCollectionModal;
