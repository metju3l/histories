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
import jwt from 'jsonwebtoken';
import Cookie from 'js-cookie';

const Home: FC = () => {
  const username = jwt.decode(Cookie.get('jwt'))?.username;
  let loggedUserInfo;
  if (username !== null) {
    loggedUserInfo = useGetUserInfoQuery({
      variables: { username: username },
    });
  }
  const [page, setPage] = useState('feed');
  const { data, loading, error } = useIsLoggedQuery();

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
        <nav>
          <ul className="bg-opacity-50 backdrop-filter backdrop-blur-md text-white bg-black w-full fixed top-0 z-20">
            <Link href="/">
              <li className="active py-1.5 px-4 ml-8 float-left">
                <a className="text-center display-block">
                  <IoLogoWordpress size={42} />{' '}
                  {/* hope that oonce here will be some normal logo xdd :(*/}
                </a>
              </li>
            </Link>
            <li className="active py-4 px-4 float-left">
              <div className="w-full flex bg-white text-black p-2 rounded-full ">
                <button
                  type="submit"
                  className="focus:outline-none inline-block "
                >
                  <BiSearchAlt2 size={24} />
                </button>
                <input
                  className="w-11/12 rounded-sm outline-none border-none inline-block text-light-text"
                  placeholder="Search..."
                />
              </div>
            </li>
            {isLogged && (
              <li className="active py-1.5 px-4 ml-8 float-right text-center pt-4 flex">
                <div className="flex text-center bg-gray-400 p-1 rounded-3xl">
                  <div className="rounded-full h-8 w-8 bg-red-500 mr-1"></div>
                  {loggedUserInfo?.data?.getUserInfo?.firstName}
                </div>
                <Menu>
                  <Menu.Button>
                    <IoIosArrowDropdownCircle size={32} />
                  </Menu.Button>
                </Menu>
              </li>
            )}
          </ul>
        </nav>
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
