import Head from 'next/head';
import React, { useState } from 'react';
import { IoIosArrowBack, IoIosSettings } from 'react-icons/io';
import { FiPlusCircle } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import { useIsLoggedQuery } from '../src/graphql/user.graphql';

import { Post, Map, Search, CreatePost } from '@components/mainPage';

const Home = (): JSX.Element => {
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <body className="font-inter min-h-screen overflow-x-hidden">
        <ul className="bg-opacity-50 backdrop-filter text-white backdrop-blur-md bg-black w-full fixed top-0">
          <li className="active py-4 px-4 pl-20 float-left">
            <a className="text-center display-block">About</a>
          </li>
          <li className="active py-4 px-4 float-left">
            <a className="text-center display-block">Lorem ipsum</a>
          </li>
          <li className="active py-4 px-4 float-left">
            <a className="text-center">Lorem ipsum</a>
          </li>
          <li className="active py-4 px-4 float-left">
            <a className="text-center">Lorem ipsum</a>
          </li>
        </ul>
        <section className="h-screen bg-darkGray pt-64">
          <h1 className="text-center font-bold text-white text-9xl m-auto w-2/3">
            hiStories
          </h1>
          <h2 className="text-center text-lightGray text-4xl w-2/3 m-auto ">
            share history with the whole world idk just placeholder
          </h2>
        </section>{' '}
        <section className="min-h-screen bg-white pt-64">
          <h1 className="text-center font-bold text-black text-9xl m-auto w-2/3">
            A New Kind of Social site
          </h1>
          <h2 className="text-center text-lightGray font-bold text-4xl font w-2/3 m-auto ">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Consequatur nulla, fuga
          </h2>
          <p className="text-center text-lightGray text-xl w-2/3 m-auto">
            More Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Totam, obcaecati aut sunt sequi tempora provident iste accusantium
            ea vitae ipsam quas veritatis voluptates molestias aperiam, ab
            deleniti tempore eos minima adipisci! Quod quaerat labore odio
            quibusdam accusamus, in earum assumenda error, explicabo ullam
            <br />
            <button className="text-white bg-blue-500 rounded-xl text-xl px-6 py-2 mt-12">
              Browse photos
            </button>
          </p>
          <div className="text-white bg-gray-800 text-center w-3/4 m-auto rounded-2xl text-xl py-48 mt-12 relative top-32">
            view map
          </div>
        </section>
        <section className="h-screen bg-black text-white pt-64">
          <h1 className="text-center font-bold text-9xl m-auto w-2/3">
            I already don't know what to write hear
          </h1>
        </section>
      </body>
    </>
  );
};

export default Home;
