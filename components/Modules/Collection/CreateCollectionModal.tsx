import Button from '@components/Elements/Buttons/Button';
import { LoginContext } from '@components/Layouts';
import { Modal } from '@components/Modules/Modal';
import { useCreateCollectionMutation } from '@graphql/collection.graphql';
import { Switch } from '@headlessui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const CreateCollectionModal: React.FC<{
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
  openState: boolean;
  refetch: any;
}> = ({ openState, setOpenState, refetch }) => {
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
    setOpenState(false);
    await refetch();
  };

  return (
    <Modal
      title="New collection"
      isOpen={openState}
      setOpenState={setOpenState}
    >
      <div className="px-6 pb-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="w-full h-10 max-w-sm px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
            placeholder="Collection name"
            {...register('name', { required: true })}
          />
          <textarea
            className="w-full max-w-xl p-1 px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
            placeholder="description"
            rows={5}
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
              <span
                aria-hidden="true"
                className={`${isPrivate ? 'translate-x-3' : 'translate-x-0'}
            pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
              />
            </Switch>
          </div>
          <p className="pb-2">
            {isPrivate
              ? 'Only you will see this collection'
              : 'Collection will be visible to anyone'}
          </p>
          <Button loading={isLoading} style="primary_solid">
            Submit
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default CreateCollectionModal;
