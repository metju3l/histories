import Head from 'next/head';
import React, { useState } from 'react';
import { IoIosArrowBack, IoIosSettings } from 'react-icons/io';
import { FiPlusCircle } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';

import { Post, Map, Search, CreatePost } from '../src/components/mainPage';

const Home = () => {
  const [page, setPage] = useState('feed');

  return (
    <>
      <Head>
        <title>hiStories</title>
        <meta name="description" content="hiStories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute w-screen h-screen">
        <Map />
      </div>

      <div className="flex w-screen">
        <div className="p-4 left-0 top-0 w-1/2 max-w-sidebar"></div>
        <div className="absolute p-4 left-0 top-0 w-1/2 max-w-sidebar h-screen">
          <div className="bg-white bg-opacity-75 w-full h-full rounded-lg p-2 backdrop-filter backdrop-blur-md">
            {page === 'feed' ? (
              <div className=" overflow-y-scroll scrollbar-hide overflow-x-hidden h-content">
                <Post
                  username="czM1K3"
                  url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
                />
                <Post
                  username="kahy9"
                  url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
                />
                <Post
                  username="krystofex"
                  url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
                />
                <Post
                  username="kewin"
                  url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
                />
              </div>
            ) : (
              <>
                <a onClick={() => setPage('feed')}>{'<back'}</a>
                <CreatePost />
              </>
            )}
          </div>
        </div>
        <div className="z-10 h-10 mt-4">
          <IoIosArrowBack
            className="bg-opacity-75 backdrop-filter backdrop-blur-md bg-white rounded-lg text-black h-10 w-10 p-2 mb-2"
            size={8}
          />
          <CgProfile
            className="bg-opacity-75 backdrop-filter backdrop-blur-md bg-white rounded-lg text-black h-10 w-10 p-2 mb-2"
            size={8}
          />
          <IoIosSettings
            className="bg-opacity-75 backdrop-filter backdrop-blur-md bg-white rounded-lg text-black h-10 w-10 p-2 mb-2"
            size={8}
          />
          <FiPlusCircle
            className="bg-opacity-75 backdrop-filter backdrop-blur-md bg-white rounded-lg text-black h-10 w-10 p-2"
            size={8}
            onClick={() => setPage('create')}
          />
        </div>
        <div className="flex z-10 h-10 ml-4 mt-4">
          <Search />
        </div>
      </div>
    </>
  );
};

export default Home;
