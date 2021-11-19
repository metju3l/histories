import 'react-dropdown/style.css';

import { ApolloQueryResult } from '@apollo/client';
import { ProfileLayout } from '@components/Layout';
import SubmitButton from '@components/LoadingButton/SubmitButton';
import { Modal } from '@components/Modal';
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
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import { ErrorMessage, Field, Form, Formik } from 'formik';
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
  if (loading || logged.loading)
    return (
      <ProfileLayout
        title={`loading collections | hiStories`}
        leftColumn={
          <div className="sticky top-40">
            {/* PROFILE PICTURE */}
            <div className="absolute w-48 h-48 bg-gray-600 rounded-full shadow-2xl mt-[-40px]" />
            {/* PROFILE INFO */}
            <div className="pt-[11rem]">
              {/* NAME */}
              <h1 className="flex items-center text-4xl text-white">Loading</h1>
              {/* USERNAME */}
              <h2 className="pt-2 text-3xl cursor-pointer text-[#0ACF83]">
                @loading
              </h2>
              <p className="flex pt-4 text-2xl text-white gap-8">
                {/* FOLLOWERS */}
                <h2 className="cursor-pointer">
                  Loading
                  <br />
                  <span className="text-xl opacity-70">Followers</span>
                </h2>
                {/* FOLLOWING */}
                <h2 className="cursor-pointer">
                  Loading
                  <br />
                  <span className="text-xl opacity-70">Following</span>
                </h2>
              </p>
              {/* EDIT BUTTON */}
              <button
                type="button"
                onClick={() => {}}
                className="inline-flex items-center justify-center h-10 mt-6 font-medium tracking-wide text-white rounded-lg bg-[#0ACF83] w-52 transition duration-200 hover:opacity-90"
              >
                Loading{' '}
              </button>
              {/* BIO */}
              <p className="mt-4 text-white">loading</p>
            </div>
          </div>
        }
        rightColumn={
          <div>
            <div className="flex items-center justify-between w-full px-4 pb-4">
              <div className="">
                <PlusIcon className="w-6 h-6 text-white" />
              </div>
              <span className="flex items-center text-white">
                <div className="mr-2"> sort by</div>
                <Dropdown
                  options={sortOptions}
                  value={sortOptions[0]}
                  placeholder="Select an option"
                  className="w-36"
                />
              </span>
            </div>
            <div className="flex gap-10">
              <CollectionCardLoading />
              <CollectionCardLoading />
              <CollectionCardLoading />
            </div>
          </div>
        }
        menu={
          <>
            <button className="px-6 py-2 text-gray-200 hover:bg-[#484A4D] rounded-xl">
              Posts
            </button>
            <button className="px-6 py-2 text-gray-200 bg-[#484A4D] rounded-xl">
              Collections
            </button>
            <button className="px-6 py-2 text-gray-200 hover:bg-[#484A4D] rounded-xl">
              Map
            </button>
          </>
        }
      />
    );
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
      <ProfileLayout
        title={`${data.user.firstName}'s collections | hiStories`}
        leftColumn={
          <div className="sticky top-40">
            {/* PROFILE PICTURE */}
            <div className="absolute bg-gray-700 rounded-full shadow-2xl w-[10rem] h-[10rem] mt-[-40px]">
              <Image
                src={GeneratedProfileUrl(
                  data.user.firstName,
                  data.user.lastName
                )}
                layout="fill"
                objectFit="contain"
                objectPosition="center"
                className="rounded-full"
                alt="Profile picture"
              />
            </div>
            {/* PROFILE INFO */}
            <div className="pt-[9rem]">
              {/* NAME */}
              <h1 className="flex items-center text-3xl font-semibold text-white">
                {data.user.firstName} {data.user.lastName}
                {/* NEW USER BADGE */}
                {new Date().getTime() - data.user.createdAt < 129600000 && (
                  <div className="px-4 py-2 ml-4 text-xl bg-[#a535fa96] rounded-2xl">
                    new user
                  </div>
                )}
              </h1>
              {/* USERNAME */}
              <Link href={'/' + data.user.username} passHref>
                <h2 className="pt-2 text-2xl cursor-pointer text-[#ffffff9a]">
                  @{data.user.username}
                </h2>
              </Link>
              <p className="flex pt-4 text-2xl text-white gap-8">
                {/* FOLLOWERS */}
                <h2 className="cursor-pointer">
                  {data.user.followers?.length}
                  <br />
                  <span className="text-xl text-[#ffffff9a] opacity-70">
                    Followers
                  </span>
                </h2>
                {/* FOLLOWING */}
                <h2 className="cursor-pointer">
                  {data.user.following?.length}
                  <br />
                  <span className="text-xl text-[#ffffff9a] opacity-70">
                    Following
                  </span>
                </h2>
              </p>
              {isLogged &&
                /* FOLLOW BUTTON */
                (logged.data?.isLogged!.id !== data.user.id ? (
                  <div className="pt-6">
                    <FollowButton data={data} refetch={refetch} />
                  </div>
                ) : (
                  /* EDIT BUTTON */
                  <button
                    type={isLoading ? 'button' : 'submit'}
                    onClick={() => setEditMode(!editMode)}
                    className="inline-flex items-center justify-center h-10 mt-6 font-medium tracking-wide text-white rounded-lg bg-[#0ACF83] w-52 transition duration-200 hover:opacity-90"
                  >
                    {editMode ? 'Save' : 'Edit profile'}
                  </button>
                ))}
              {/* BIO */}
              <p className="mt-4 text-white">{data.user.bio}</p>
            </div>
          </div>
        }
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
            <div className="flex gap-10">
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
const Input: FC<{
  type: string;
  name: string;
  autoComplete: string;
  label: string;
}> = ({ type, name, autoComplete, label }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Field
        type={type}
        className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        name={name}
        autoComplete={autoComplete}
      />
      <ErrorMessage name={name} />
      <br />
    </div>
  );
};

const FollowButton = ({ data, refetch }: any) => {
  const [followMutation] = useFollowMutation();
  const [unfollowMutation] = useUnfollowMutation();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SubmitButton
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
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
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

        <SubmitButton
          isLoading={isLoading}
          text="Submit"
          backgroundClassname="bg-[#0a70cf] hover:opacity-90"
        />
      </form>
    </div>
  );
};

export default Collections;
