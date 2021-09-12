import React, { FC, useState } from 'react';
import { NextPageContext } from 'next';
import Router from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { ErrorMessage, Field, Form, Formik } from 'formik';

import {
  useFollowMutation,
  useUnfollowMutation,
} from '@graphql/relations.graphql';
import { useUpdateProfileMutation } from '@graphql/user.graphql';
import { useGetUserInfoQuery, useIsLoggedQuery } from '@graphql/user.graphql';

import { AccountCreatedPost } from 'components/ProfilePage';
import { Navbar } from 'components/Navbar';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import { Button } from '@nextui-org/react';

const User: FC<{ username: string }> = ({ username }) => {
  const { data, loading, error, refetch } = useGetUserInfoQuery({
    variables: { username: username },
  });
  const logged = useIsLoggedQuery();

  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProfileMutation] = useUpdateProfileMutation();

  if (error) return <div>error</div>;
  if (loading) return <div>loading</div>;
  if (logged.loading) return <div>loading</div>;
  if (logged.error) return <div>error</div>;
  if (data === null || data === undefined)
    return <div>user does not exist</div>;
  const isLogged = logged.data!.isLogged;

  return (
    <>
      <Head>
        <title>{`${data.user.firstName} ${data.user.lastName} | hiStories`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="hiStories" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
        <Navbar data={data} />
        <main className="flex max-w-screen-xl m-auto">
          <div className="w-full">
            <div className="relative rounded-full w-36 h-36 m-auto">
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

            <h2 className="text-center text-2xl py-4">
              {`${data.user.firstName} ${data.user.lastName}`}
            </h2>
            <div className="text-center text-md py-4 w-[60%] m-auto">
              {isLogged && logged.data?.isLogged!.id === data.user.id ? (
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
                          setIsLoading(true);
                          try {
                            await editProfileMutation({
                              variables: values,
                            });
                          } catch (error) {
                            console.log(error);
                          }
                          // if username has changed redirect to new page
                          if (values.username !== data.user.username)
                            Router.push(`/${values.username}`);
                          else await refetch();
                          setEditMode(false);
                          setIsLoading(false);
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
                            {isLoading ? (
                              <Button loading loaderType="spinner" />
                            ) : (
                              <Button type="submit">Submit</Button>
                            )}
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
            <AccountCreatedPost
              date={data.user.createdAt}
              firstName={data.user.firstName}
            />
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

const FollowButton = ({ data, logged, refetch }: any) => {
  const [followMutation] = useFollowMutation();
  const [unfollowMutation] = useUnfollowMutation();

  return (
    <>
      <button
        className={`float-right ml-4 rounded-lg text-white ${
          data.user.isFollowing ? 'bg-indigo-400' : 'bg-indigo-600'
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
            console.log(error);
          }
        }}
      >
        {data.user.isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </>
  );
};

export default User;
