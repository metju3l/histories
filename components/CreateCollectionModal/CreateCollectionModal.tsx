import { Button } from '@components/Button';
import { LoginContext } from '@components/Layout';
import { useCreateCollectionMutation } from '@graphql/user.graphql';
import { Dialog, Switch, Transition } from '@headlessui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const CreateCollectionModal: React.FC<{
  onClose: () => void;
  openState: boolean;
}> = ({ openState, onClose }) => {
  const loginContext = React.useContext(LoginContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const [createCollection] = useCreateCollectionMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = async (data: { name: string; description: string }) => {
    setIsLoading(true);
    try {
      await createCollection({
        variables: { ...data, isPrivate },
      });
      toast.success('Collection created');
      reset({ name: '', description: '' });
    } catch (error: any) {
      toast.error(error.message);
    }
    setIsLoading(false);
    onClose();
  };

  return (
    <Transition appear show={openState} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
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
                as="div"
                className="flex justify-between text-lg font-medium text-gray-900 leading-6"
              >
                <h3>New collection</h3>
                <button onClick={onClose}>close</button>
              </Dialog.Title>
              <div className="mt-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input
                    className="w-full h-10 px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
                    placeholder="Collection name"
                    {...register('name', { required: true })}
                  />
                  <input
                    className="w-full h-10 px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
                    placeholder="description"
                    {...register('description')}
                  />
                  <div className="flex items-center py-2 gap-4">
                    <a className="w-12">Private</a>
                    <Switch
                      checked={isPrivate}
                      onChange={setIsPrivate}
                      className={`${isPrivate ? 'bg-blue-400' : 'bg-gray-200'}
          relative inline-flex flex-shrink-0 h-5 w-8 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`${
                          isPrivate ? 'translate-x-3' : 'translate-x-0'
                        }
            pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                      />
                    </Switch>
                  </div>
                  <p className="pb-2">
                    {isPrivate
                      ? 'Only you will see this collection'
                      : 'Collection will be visible to anyone'}
                  </p>
                  <Button
                    isLoading={isLoading}
                    text="Submit"
                    backgroundClassname="bg-[#0a70cf] hover:opacity-90"
                  />
                </form>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateCollectionModal;
