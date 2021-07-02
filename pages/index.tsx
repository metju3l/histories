import 'tailwindcss/tailwind.css';
import Head from 'next/head';
import React from 'react';

import { Post, Map, Search } from '../src/components/mainPage';

import { IoIosArrowBack, IoMdAdd } from 'react-icons/io';
import { AiOutlineUser } from 'react-icons/ai';

const Home = () => {
  return (
    <>
      <Head>
        <title>hiStories</title>
        <meta name="description" content="hiStories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute z-0 w-screen h-screen bg-blue-100">
        <Map />
      </div>

      <div className="absolute flex left-0 top-0 z-10 h-screen w-2/5 py-4 pl-4 ">
        <div className="bg-white bg-opacity-80 w-full h-full rounded-widget p-2 ">
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
        </div>
        <div className="">
          <AiOutlineUser
            className="ml-2 mb-2 bg-white text-black rounded-full"
            size={36}
          />
          <IoMdAdd
            className="ml-2 mb-2 bg-white text-black rounded-full"
            size={36}
          />
          <IoIosArrowBack
            className="pl-2 bg-white rounded-r-2xl text-black h-12 w-11"
            size={36}
          />
        </div>
      </div>
      <div className="absolute left-1/2 w-1/3 top-4 z-10  ">
        <Search />
      </div>
    </>
  );
};

export default Home;
