import 'react-dropdown/style.css';

import { ApolloQueryResult } from '@apollo/client';
import { Button } from '@components/Button/';
import { Modal } from '@components/Modal';
import { ProfilePage } from '@components/ProfilePage';
import { useCollectionQuery } from '@graphql/collection.graphql';
import {
  GetUserInfoQuery,
  useCreateCollectionMutation,
  useGetUserInfoQuery,
  useIsLoggedQuery,
} from '@graphql/user.graphql';
import { PlusIcon } from '@heroicons/react/solid';
import hoverHandler from '@hooks/hoverHandler';
import { NextPageContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import Dropdown from 'react-dropdown';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const Collections: FC<{ username: string }> = ({ username }) => {
  const router = useRouter();
  const { data, loading, error, refetch } = useGetUserInfoQuery({
    variables: { username: username },
  });
  const logged = useIsLoggedQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const sortOptions = [
    { value: 'hot', label: 'Hot' },
    { value: 'mostliked', label: 'Most liked' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ];

  if (error) {
    return <div>error...</div>;
  }
  if (loading || logged.loading) return <div>loading</div>;
  if (logged.error) {
    console.log(logged.error);
    return <div>error</div>;
  }
  if (data === null || data === undefined)
    return <div>user does not exist</div>;
  const isLogged = logged.data!.isLogged;

  return (
    <>
      {createModal && (
        <Modal onClose={() => setCreateModal(false)} open={createModal}>
          <CreateCollectionModal
            refetch={refetch}
            setCreateModal={setCreateModal}
          />
        </Modal>
      )}
      <ProfilePage
        title={`${data.user.firstName}'s collections | hiStories`}
        username={data.user.username}
        rightColumn={
          <div>
            <div className="flex items-center justify-between w-full px-4 pb-4">
              <div className="">
                {isLogged && (
                  <PlusIcon
                    className="w-6 h-6 text-white"
                    onClick={async () => {
                      setCreateModal(true);
                    }}
                  />
                )}
              </div>
              <span className="flex items-center text-white">
                <div className="mr-2"> sort by</div>
                <Dropdown
                  options={sortOptions}
                  onChange={(e) => {
                    // save the sort option in url query
                    router.replace({
                      pathname: `/${data.user.username}/collections`,
                      query: {
                        sortBy: e.value,
                      },
                    });
                  }}
                  value={sortOptions[0]}
                  placeholder="Select an option"
                  className="w-36"
                />
              </span>
            </div>
            <div className="grid grid-cols-3 gap-10">
              {data.user?.collections &&
                data.user.collections.map((collection) => (
                  <CollectionCard id={collection!.id} key={collection!.id} />
                ))}
            </div>
          </div>
        }
      />
    </>
  );
};

export const getServerSideProps = async (
  context: NextPageContext
): Promise<{
  props: {
    username: string;
  };
}> => {
  return {
    props: {
      // @ts-ignore
      username: context.query.username.toString(),
    },
  };
};

const CollectionCard: React.FC<{ id: number }> = ({ id }) => {
  // get collection data
  const { data, loading, error } = useCollectionQuery({ variables: { id } });

  const [hover, setHover] = useState(false);

  if (loading) return <div>loading</div>;
  if (data?.collection === undefined || error)
    // loading placeholder
    return (
      <a
        className="relative cursor-pointer w-[18rem] h-96 bg-[#242427] rounded-xl"
        {...hoverHandler(setHover)}
      >
        <div
          className={`absolute bottom-0 w-full backdrop-filter backdrop-blur-xl rounded-xl ${
            hover ? 'h-full' : ''
          }`}
        >
          <p className="w-full h-10 p-2 text-white bg-black border-t border-gray-400 opacity-70 rounded-b-xl"></p>
        </div>
      </a>
    );

  return (
    <Link href={`/collection/${id}`}>
      <a
        className="relative cursor-pointer w-[18rem] h-96 bg-[#242427] rounded-xl"
        {...hoverHandler(setHover)}
      >
        <Image
          src={
            'https://histories-bucket.s3.eu-central-1.amazonaws.com/1636471330157-3398b12b.jpg'
          }
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="rounded-xl"
          alt="Profile picture"
        />
        <div
          className={`absolute bottom-0 w-full backdrop-filter backdrop-blur-xl rounded-xl ${
            hover ? 'h-full' : ''
          }`}
        >
          <p
            className={`w-full p-2 text-white bg-black opacity-70 ${
              hover
                ? 'h-full rounded-xl'
                : 'border-t border-gray-400 rounded-b-xl'
            }`}
          >
            {/* on hover show description */}
            {hover ? (
              <>
                <a className="font-semibold">{data.collection.name}</a>
                <br />
                <p className="pt-4">{data.collection.description}</p>
              </>
            ) : (
              data.collection.name
            )}
          </p>
        </div>
      </a>
    </Link>
  );
};

const CreateCollectionModal: React.FC<{
  refetch: (variables?: any) => Promise<ApolloQueryResult<GetUserInfoQuery>>;
  setCreateModal: (value: React.SetStateAction<boolean>) => void;
}> = ({ refetch, setCreateModal }) => {
  const [createCollection] = useCreateCollectionMutation();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: { name: string; description: string }) => {
    setIsLoading(true);
    try {
      await createCollection({
        variables: data,
      });
      await refetch();
    } catch (error) {
      // @ts-ignore
      toast.error(error.message);
    }
    setIsLoading(false);
    setCreateModal(false);
  };

  return (
    <div className="absolute z-50 w-1/2 p-8 bg-gray-900 rounded-xl h-1/2 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
      <h2 className="text-white">create collection</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="w-full h-10 px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
          placeholder="name"
          {...register('name', { required: true })}
        />
        <input
          className="w-full h-10 px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
          placeholder="description"
          {...register('description', { required: true })}
        />
        {errors.description && <span>This field is required</span>}

        <Button
          isLoading={isLoading}
          text="Submit"
          backgroundClassname="bg-[#0a70cf] hover:opacity-90"
        />
      </form>
    </div>
  );
};

export default Collections;
