import Head from 'next/head';
import React, { FC, useState } from 'react';
import { useIsLoggedQuery } from '../src/graphql/user.graphql';
import { IoLogoWordpress } from 'react-icons/io';
import { MdAddBox, MdMap } from 'react-icons/md';
import { BiSearchAlt2 } from 'react-icons/bi';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import Link from 'next/link';
import { Post } from '@components/MainPage';
import { useGetUserInfoQuery } from '@graphql/getUserInfo.graphql';
import { Menu } from '@headlessui/react';
import useDarkMode from '@hooks/useDarkmode';
import { Navbar } from '@components/Navbar';

const Home: FC = () => {
  // @ts-ignore
  const [theme, setTheme] = useDarkMode();
  const [page, setPage] = useState('feed');
  const { data, loading, error } = useIsLoggedQuery();
  const [accountDropdown, setAccountDropdown] = useState('main');
  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;
  const isLogged = data?.isLogged;

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
              <>
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
              </>
            ) : (
              page === 'createPost' && (
                <div className="h-screen text-white">
                  <div
                    className="w-full p-4 rounded-2xl text-black"
                    style={{ backgroundColor: '#242526' }}
                  >
                    <label className="text-white ">Description</label>
                    <input
                      className="w-11/12 rounded-lg outline-none border-none inline-block text-light-text"
                      placeholder="Search..."
                    />
                    <label className="text-white ">Location</label>
                    <input
                      className="w-11/12 rounded-lg outline-none border-none inline-block text-light-text"
                      placeholder="Search..."
                    />
                  </div>
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

export default Home;
