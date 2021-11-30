import EditCollectionModal from '@components/Collection/EditCollectionModal';
import { LoginContext } from '@components/Layout/Layout';
import {
  useCollectionQuery,
  useEditCollectionMutation,
} from '@graphql/collection.graphql';
import Link from 'next/link';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type Inputs = {
  name: string;
  description: string;
};

const CollectionPanel: React.FC<{
  id: number;
}> = ({ id }) => {
  const loginContext = React.useContext(LoginContext);

  const [editMode, setEditMode] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const { data, loading, error, refetch } = useCollectionQuery({
    variables: { id },
  });

  const [editCollection] = useEditCollectionMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      await editCollection({
        variables: { ...formData, isPrivate, collectionId: id },
      });
      toast.success('Collection edited');
    } catch (error: any) {
      toast.error(error.message);
    }
    setEditMode(false);
    await refetch();
  };

  if (loginContext.loading || loading) return <div>loading</div>;
  if (loginContext.error) return <div>error</div>;

  return (
    <div className="sticky top-40">
      {/* PROFILE PICTURE */}
      <div className="absolute rounded-full shadow-md bg-secondary w-[10rem] h-[10rem] mt-[-40px]"></div>
      {/* PROFILE INFO */}
      <EditCollectionModal
        setOpenState={setEditMode}
        openState={editMode}
        id={id}
        refetch={refetch}
        // @ts-ignore
        collection={data?.collection}
      />
      <div className="pt-[9rem]">
        {/* NAME */}
        <h1 className="flex items-center text-3xl font-semibold text-primary">
          {data?.collection.name}
        </h1>
        {/* USERNAME */}
        <Link href={'/' + data?.collection.author.username} passHref>
          <h2 className="pt-2 text-2xl cursor-pointer text-secondary">
            author: @{data?.collection.author.username}
          </h2>
        </Link>

        {/* DESCRIPTION */}
        <p className="mt-4 break-words whitespace-pre-wrap text-primary">
          {data?.collection.description}
        </p>

        {/* EDIT BUTTON */}
        {loginContext.data?.isLogged?.id === data?.collection.author.id && (
          <button
            onClick={() => setEditMode(true)}
            className="inline-flex items-center justify-center h-10 mt-6 font-medium tracking-wide text-white rounded-lg bg-[#0ACF83] w-52 transition duration-200 hover:opacity-90"
          >
            Edit collection
          </button>
        )}
      </div>
    </div>
  );
};

export default CollectionPanel;
