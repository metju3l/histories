import Head from 'next/head';
import React, { FC, useState } from 'react';
import { MdAddBox, MdMap } from 'react-icons/md';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import Link from 'next/link';
import { Post } from '@components/MainPage';
import useDarkMode from '@hooks/useDarkmode';
import { Navbar } from '@components/Navbar';
import { useIsLoggedQuery } from '@graphql/getUserInfo.graphql';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useCreatePostMutation } from '@graphql/user.graphql';

const Home: FC = () => {
  const [page, setPage] = useState('feed');
  const { data, loading, error } = useIsLoggedQuery();
  const [createPostMutation] = useCreatePostMutation();

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;
  const isLogged = data!.isLogged.isLogged;

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
        <main className="w-full flex">
          <div
            className="w-2/5 pt-20 m-auto"
            style={{ backgroundColor: '#18191A' }}
          >
            {page === 'feed' ? (
              <div className="text-white h-screen">no posts yet</div>
            ) : (
              page === 'createPost' && (
                <div className="h-screen text-white">
                  <Formik
                    initialValues={{
                      latitude: '',
                      longitude: '',
                      description: '',
                      hashtags: '',
                    }}
                    onSubmit={async (values) => {
                      try {
                        await createPostMutation({
                          variables: values,
                        });
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    {() => (
                      <Form>
                        <Input
                          label="Description"
                          name="description"
                          type="text"
                        />
                        <Input label="Hashtags" name="hashtags" type="text" />
                        <Input label="latitude" name="latitude" type="text" />
                        <Input label="longitude" name="longitude" type="text" />
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          type="submit"
                        >
                          submit
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              )
            )}
          </div>
          <div
            className="h-full w-1/4 pt-20 text-white fixed right-0 top-0"
            style={{ backgroundColor: '#18191A' }}
          >
            <div
              className="w-full p-4 rounded-2xl text-white flex"
              style={{ backgroundColor: '#242526' }}
            >
              {isLogged &&
                (page === 'createPost' ? (
                  <AiOutlineCloseCircle
                    size={32}
                    className="mr-2"
                    onClick={() => setPage('feed')}
                  />
                ) : (
                  <MdAddBox
                    size={32}
                    className="mr-2"
                    onClick={() => setPage('createPost')}
                  />
                ))}
              <Link href="/map">
                <MdMap size={32} />
              </Link>
            </div>
          </div>
        </main>
      </body>
    </>
  );
};
const Input: FC<{
  type: string;
  name: string;
  label: string;
}> = ({ type, name, label }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Field
        type={type}
        className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        name={name}
      />
      <ErrorMessage name={name} />
      <br />
    </div>
  );
};
export default Home;
