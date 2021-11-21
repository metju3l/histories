import 'react-dropdown/style.css';

import { ApolloQueryResult } from '@apollo/client';
import { Button } from '@components/Button/';
import { Input } from '@components/Input';
import { Modal } from '@components/Modal';
import { ProfilePage } from '@components/ProfilePage';
import {
  useFollowMutation,
  useUnfollowMutation,
} from '@graphql/relations.graphql';
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
                  <CollectionCard
                    preview="https://histories-bucket.s3.eu-central-1.amazonaws.com/1636471330157-3398b12b.jpg"
                    title={collection?.name ?? ''}
                    description={collection?.description ?? ''}
                    address={`/${data.user.username}/collections/${
                      collection!.id
                    }`}
                    key={collection!.id}
                  />
                ))}
            </div>
          </div>
        }
        menu={
          <>
            {' '}
            <Link href={'/' + data.user.username} passHref>
              <button className="px-6 py-2 text-gray-200 hover:bg-[#484A4D] rounded-xl">
                Posts
              </button>
            </Link>
            <Link href={'/' + data.user.username + '/collections'} passHref>
              <button className="px-6 py-2 text-gray-200 bg-[#484A4D] rounded-xl">
                Collections
              </button>
            </Link>
            <Link href={'/' + data.user.username + '/map'} passHref>
              <button className="px-6 py-2 text-gray-200 hover:bg-[#484A4D] rounded-xl">
                Map
              </button>
            </Link>
            {logged.data?.isLogged?.id === data.user.id && (
              <Link href={'/settings'} passHref>
                <button className="px-6 py-2 text-gray-200 hover:bg-[#484A4D] rounded-xl">
                  Settings
                </button>
              </Link>
            )}
          </>
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

const FollowButton = ({ data, refetch }: any) => {
  const [followMutation] = useFollowMutation();
  const [unfollowMutation] = useUnfollowMutation();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      text={data.user.isFollowing ? 'Unfollow' : 'Follow'}
      backgroundClassname={
        data.user.isFollowing
          ? 'bg-[#0ACF83] hover:opacity-90'
          : 'bg-[#474DFE] hover:opacity-90'
      }
      isLoading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          if (data.user.isFollowing) {
            await unfollowMutation({
              variables: { userID: data.user.id },
            });
          } else {
            await followMutation({
              variables: { userID: data.user.id },
            });
          }
          await refetch();
        } catch (error) {
          // @ts-ignore
          toast.error(error.message);
        }
        setIsLoading(false);
      }}
    />
  );
};

const CollectionCard: React.FC<{
  preview: string;
  description: string;
  title: string;
  address: string;
}> = ({ preview, title, description, address }) => {
  const [hover, setHover] = useState(false);

  return (
    <Link href={address} passHref>
      <div
        className="relative cursor-pointer w-[18rem] h-96 bg-[#242427] rounded-xl"
        {...hoverHandler(setHover)}
      >
        <Image
          src={preview}
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
                <a className="font-semibold">{title}</a>
                <br />
                <p className="pt-4">{description}</p>
              </>
            ) : (
              title
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};
const CollectionCardLoading: React.FC = () => {
  return (
    <div className="relative w-[18rem] h-96 bg-[#242427] rounded-xl">
      <div className="absolute bottom-0 w-full backdrop-filter backdrop-blur-xl rounded-b-xl">
        <p className="w-full p-2 text-white bg-black border-t border-gray-400 rounded-b-xl opacity-70">
          Loading
        </p>
      </div>
    </div>
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
        <Input placeholder="name" {...register('name', { required: true })} />
        <Input
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
