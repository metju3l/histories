import React, { FC, useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { number } from 'yup/lib/locale';

import {
  useFollowMutation,
  useUnfollowMutation,
} from '@graphql/relations.graphql';
import { useUpdateProfileMutation } from '@graphql/user.graphql';
import { useGetUserInfoQuery, useIsLoggedQuery } from '@graphql/user.graphql';

import { AccountCreatedPost } from '@components/ProfilePage';
import { Post } from '@components/ProfilePage';
import { Navbar } from '@components/Navbar';
import getUserInfo from '@lib/queries/getUserInfo';

const User: FC<{ username: string }> = ({ username }) => {
  const { asPath } = useRouter();
  const { data, loading, error, refetch } = useGetUserInfoQuery({
    variables: { username: username },
  });
  const isLoggedQuery = useIsLoggedQuery();

  const [editMode, setEditMode] = useState(false);
  const [editProfileMutation] = useUpdateProfileMutation();

  if (error) return <div>error</div>;
  if (loading) return <div>loading</div>;
  if (isLoggedQuery.loading) return <div>loading</div>;
  if (isLoggedQuery.error) return <div>error</div>;
  if (data === null || data === undefined)
    return <div>user does not exist</div>;

  return (
    <>
      <Head>
        <title>{`${data.user.firstName} ${data.user.lastName} | hiStories`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="hiStories" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body>
        {/* @ts-ignore */}
        <Navbar data={isLoggedQuery.data} />

        <main className="w-full pt-20 bg-[#F6F8FA] text-black">
          <div className="full">
            <div className="rounded-full bg-red-500 w-36 h-36 m-auto"></div>
            <h2 className="text-center text-2xl py-4">
              {`${data.user.firstName} ${data.user.lastName}`}
            </h2>
            <div className="text-center text-md py-4 w-[60%] m-auto">
              {isLoggedQuery.data?.isLogged?.userID === data.user.username ? (
                <>
                  {!editMode ? (
                    <>
                      {data.user.bio}
                      <br />
                      <button
                        className="underline"
                        onClick={() => setEditMode(true)}
                      >
                        edit
                      </button>
                    </>
                  ) : (
                    <>
                      <Formik
                        initialValues={{
                          firstName: data.user.firstName,
                          lastName: data.user.lastName,
                          bio: data.user.bio,
                          username: data.user.username,
                          email: data.user.email,
                        }}
                        onSubmit={async (values) => {
                          try {
                            await editProfileMutation({
                              variables: values,
                            });
                            setEditMode(false);
                          } catch (error) {
                            console.log(error);
                          }
                          refetch({
                            username: username,
                          });
                        }}
                      >
                        {() => (
                          <Form>
                            <Input
                              label="First name"
                              name="firstName"
                              type="text"
                              autoComplete="given-name"
                            />
                            <Input
                              label="Last name"
                              name="lastName"
                              type="text"
                              autoComplete="family-name"
                            />
                            <Input
                              label="Username"
                              name="username"
                              type="text"
                              autoComplete="username"
                            />
                            <Input
                              label="Bio"
                              name="bio"
                              type="text"
                              autoComplete="bio"
                            />
                            <Input
                              label="Email"
                              name="email"
                              type="email"
                              autoComplete="email"
                            />
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              type="submit"
                            >
                              submit
                            </button>
                          </Form>
                        )}
                      </Formik>
                      <button
                        className="underline"
                        onClick={() => setEditMode(false)}
                      >
                        leave edit
                      </button>
                    </>
                  )}
                </>
              ) : (
                data.user.bio
              )}
            </div>
            <div className="h-16 px-80 pt-3 bg-[#E8ECEF] shadow-md mb-4">
              <a className="float-left mr-4 pt-2">Posts</a>
              <a className="float-left mr-4 pt-2">
                <Link href={`${asPath}/collections/`}>Collections</Link>
              </a>

              <a className="float-left mr-4 pt-2">
                Followers {data.user!.followers!.length}
              </a>
              <a className="float-left mr-4 pt-2">
                Following {data!.user!.following!.length}
              </a>

              <FollowButton
                isLoggedQuery={isLoggedQuery}
                data={data}
                refetch={refetch}
              />
              <a className="float-right ml-4 pt-2">Message</a>
            </div>
          </div>

          <div className="flex bg-[#F6F8FA] w-[60%] m-auto pt-2 pb-10 text-black">
            <div className="h-screen w-[40%] ">col 1</div>
            <div className="w-[60%] ">
              {data.user.posts !== undefined && data.user.posts !== null
                ? data.user.posts.map((post: any) => {
                    if (post === null) return '';
                    else
                      return (
                        <Post
                          isLoggedQuery={isLoggedQuery}
                          data={data}
                          key={post.postID}
                          username={data.user.username}
                          description={post.description}
                          createdAt={post.createdAt}
                          url={post.url}
                          post={post}
                        />
                      );
                  })
                : ''}

              <AccountCreatedPost
                date={data.user.createdAt}
                firstName={data.user.firstName}
              />
            </div>
          </div>
        </main>
      </body>
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
        className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        name={name}
        autoComplete={autoComplete}
      />
      <ErrorMessage name={name} />
      <br />
    </div>
  );
};

const FollowButton = ({ data, isLoggedQuery, refetch }: any) => {
  const [followMutation] = useFollowMutation();
  const [unfollowMutation] = useUnfollowMutation();

  return (
    <>
      {' '}
      {(isLoggedQuery.data?.isLogged.isLogged || isLoggedQuery.loading) &&
        isLoggedQuery.data?.isLogged?.userID !== data.user.username && (
          <>
            <button
              className={`float-right ml-4 rounded-lg text-white ${
                data.user.isFollowing ? 'bg-indigo-600' : 'bg-indigo-600'
              } p-2`}
              onClick={async () => {
                try {
                  if (data.user.isFollowing) {
                    await unfollowMutation({
                      variables: { userID: data.user.userID },
                    });
                    refetch({
                      username: data.user.username,
                    });
                  } else {
                    await followMutation({
                      variables: { userID: data.user.userID },
                    });
                    refetch({
                      username: data.user.username,
                    });
                  }
                } catch (error) {
                  console.log(error.message);
                }
              }}
            >
              {data.user.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </>
        )}
    </>
  );
};

const CollectionIcon = () => {
  return <div className="bg-red-500 rounded-md h-24"></div>;
};

export default User;
