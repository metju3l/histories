import Head from 'next/head';
import { NextPageContext } from 'next';
import React, { FC, useState } from 'react';
import { useGetUserInfoQuery } from '../../src/graphql/getUserInfo.graphql';
import { Post } from '@components/MainPage';
import { FaConnectdevelop } from 'react-icons/fa';
import Link from 'next/link';
import {
  useFollowMutation,
  useUnfollowMutation,
} from '../../src/graphql/user.graphql';
import { useIsLoggedQuery } from '@graphql/getUserInfo.graphql';
import { useRouter } from 'next/router';
import { number } from 'yup/lib/locale';
import { Navbar } from '@components/Navbar';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useUpdateProfileMutation } from '../../src/graphql/user.graphql';

const User: FC<{ username: string }> = ({ username }) => {
  const [editMode, setEditMode] = useState(false);
  const { asPath } = useRouter();
  const [follow] = useFollowMutation();
  const [unfollow] = useUnfollowMutation();
  const [following, setFollowing] = useState(false);
  const [updateProfile] = useUpdateProfileMutation();
  const { data, loading, error } = useGetUserInfoQuery({
    variables: { username: username },
  });
  const isLoggedQuery = useIsLoggedQuery();
  const [bio, setBio] = useState<string>('');

  if (error) return <div>error</div>;
  if (loading) return <div>loading</div>;
  if (isLoggedQuery.loading) return <div>loading</div>;
  if (isLoggedQuery.error) return <div>error</div>;
  if (data?.getUserInfo === null || data === undefined)
    return <div>user does not exist</div>;
  const time = new Date(
    parseInt(data.getUserInfo.createdAt)
  ).toLocaleDateString('cs-cz');
  return (
    <>
      <Head>
        <title>hiStories</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="hiStories" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body style={{ backgroundColor: '#18191A' }}>
        <Navbar />

        <main className="w-full pt-20" style={{ backgroundColor: '#242526' }}>
          <div className="full">
            <div className="rounded-full bg-red-500 w-36 h-36 m-auto"></div>
            <h2 className="text-white text-center text-2xl py-4">
              {`${data.getUserInfo.firstName} ${data.getUserInfo.lastName}`}
            </h2>
            <p
              className="text-white text-center text-md py-4"
              style={{ borderBottom: '1px solid rgb(62,63,65)' }}
            >
              {isLoggedQuery.data?.isLogged?.userID ===
              data.getUserInfo.username ? (
                <>
                  {!editMode ? (
                    <>
                      {data.getUserInfo.bio}
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
                          firstName: data.getUserInfo.firstName,
                          lastName: data.getUserInfo.lastName,
                          bio: data.getUserInfo.bio,
                          username: data.getUserInfo.username,
                          email: data.getUserInfo.email,
                        }}
                        onSubmit={async (values) => {
                          try {
                            await updateProfile({
                              variables: values,
                            });
                            setEditMode(false);
                          } catch (error) {
                            console.log(error);
                          }
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
                        onClick={() => {
                          setEditMode(false);
                        }}
                      >
                        leave edit
                      </button>
                    </>
                  )}
                </>
              ) : (
                data.getUserInfo.bio
              )}
            </p>
            <div className="text-white h-16 px-80 pt-3">
              <a className="float-left mr-4 pt-2">Posts</a>
              <a className="float-left mr-4 pt-2">
                <Link href={`${asPath}/collections/`}>Collections</Link>
              </a>

              <a className="float-left mr-4 pt-2">
                Followers {data.getUserInfo!.followers!.length}
              </a>
              <a className="float-left mr-4 pt-2">
                Following {data!.getUserInfo!.following!.length}
              </a>

              {(isLoggedQuery.data?.isLogged.isLogged ||
                isLoggedQuery.loading) &&
                isLoggedQuery.data?.isLogged?.userID !==
                  data.getUserInfo.username && (
                  <>
                    <button
                      className="float-right ml-4 rounded-lg bg-gray-500 p-2"
                      onClick={async () => {
                        try {
                          data.getUserInfo.isFollowing
                            ? await unfollow({
                                variables: { userID: data.getUserInfo.userID },
                              })
                            : await follow({
                                variables: { userID: data.getUserInfo.userID },
                              });
                        } catch (error) {
                          console.log(error.message);
                        }
                      }}
                    >
                      {data.getUserInfo.isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                    <a className="float-right ml-4 pt-2">Message</a>
                  </>
                )}
            </div>
          </div>
          <div className="w-full pt-20" style={{ backgroundColor: '#18191A' }}>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-auto" style={{ position: 'sticky' }}>
                <div
                  className="w-full rounded-2xl text-white text-center ml-2 p-4"
                  style={{ backgroundColor: '#242526' }}
                >
                  {`${data.getUserInfo.firstName}'s collections`}
                  <div className="w-full grid gap-x-4 gap-y-4 grid-cols-3 pt-4">
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                  </div>
                </div>
              </div>
              <div
                className="w-full col-auto"
                style={{ backgroundColor: '#18191A' }}
              >
                <Post
                  username="kewin"
                  url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
                />{' '}
                <Post
                  username="kewin"
                  url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
                />{' '}
                <Post
                  username="kewin"
                  url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
                />{' '}
                <Post
                  username="kewin"
                  url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
                />{' '}
                <Post
                  username="kewin"
                  url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
                />
                <div
                  className="w-full p-4 rounded-2xl text-white text-center"
                  style={{ backgroundColor: '#242526' }}
                >
                  <FaConnectdevelop size={64} className="m-auto" />
                  {data!.getUserInfo!.firstName} joined hiStories
                  <br />
                  on {time}
                </div>
                <div className="pb-20"></div>
              </div>
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

export default User;
