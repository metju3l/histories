import Head from 'next/head';
import React, { FC, useState } from 'react';
import { IoIosArrowBack, IoIosSettings } from 'react-icons/io';
import { FiPlusCircle } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import { useIsLoggedQuery } from '../src/graphql/user.graphql';
import Image from 'next/image';
import worldMap from '@public/worldMap.png';
import { FaLanguage } from 'react-icons/fa';
import { IoLogoWordpress } from 'react-icons/io';
import { AiFillGithub } from 'react-icons/ai';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import { Post, Map, Search, CreatePost } from '@components/mainPage';

const Home: FC = () => {
  const { data, loading, error } = useIsLoggedQuery();
  const [page, setPage] = useState('feed');

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
            <Link href="/">
              <li className="active py-4 px-4 float-left">
                <a className="text-center display-block">lorem ipsum</a>
              </li>
            </Link>
          </ul>
        </nav>
        <main className="w-full flex">
          <div
            className="w-2/5 pt-20 m-auto"
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
          </div>
          <div
            className="h-full w-1/4 pt-20 text-white fixed right-0 top-0"
            style={{ backgroundColor: '#18191A' }}
          >
            panel
          </div>
        </main>
      </body>
    </>
  );
};

export default Home;
