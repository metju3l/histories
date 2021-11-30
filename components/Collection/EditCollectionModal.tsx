import { Button } from '@components/Button';
import { Modal } from '@components/Modal';
import { useEditCollectionMutation } from '@graphql/collection.graphql';
import { useDeleteMutation } from '@graphql/post.graphql';
import { Switch } from '@headlessui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type Inputs = {
  name: string;
  description: string;
};

const EditCollectionModal: React.FC<{
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
  openState: boolean;
  refetch: any;
  collection?: {
    id: number;
    name: string;
    description: string;
    isPrivate: boolean;
    author: { username: string };
  };
}> = ({ openState, setOpenState, refetch, collection }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(collection!.isPrivate ?? false);
  const [editCollection] = useEditCollectionMutation();
  const [deleteMutation] = useDeleteMutation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    setIsLoading(true);
    try {
      await editCollection({
        variables: { ...formData, isPrivate, collectionId: collection!.id },
      });
      toast.success('Collection edited');
    } catch (error: any) {
      toast.error(error.message);
    }
    setOpenState(false);
    await refetch();
    setIsLoading(false);
  };

  return (
    <Modal
      title="Edit collection"
      isOpen={openState}
      setOpenState={setOpenState}
      loading={collection === undefined}
    >
      <div className="px-6 pb-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="w-full h-10 max-w-sm px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
            placeholder="Collection name"
            defaultValue={collection?.name ?? ''}
            {...register('name', { required: true })}
          />
          <textarea
            className="w-full max-w-xl p-1 px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
            placeholder="description"
            rows={5}
            defaultValue={collection?.description ?? ''}
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

          <button
            onClick={async () => {
              try {
                await deleteMutation({ variables: { id: collection!.id } });
                router.push(`/${collection?.author.username}/collections`);
                toast.success('Collection deleted');
              } catch (error: any) {
                toast.error(error.message);
              }
            }}
            type="button"
          >
            Delete collection
          </button>
          <br />
          <br />
          <br />
          <Button isLoading={isLoading} type="primary">
            Submit
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default EditCollectionModal;
