import Head from 'next/head';
import React, { FC, useState } from 'react';
import { IoIosArrowBack, IoIosSettings } from 'react-icons/io';
import { FiPlusCircle } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import { useIsLoggedQuery } from '../src/graphql/user.graphql';

import { Post, Map, Search, CreatePost } from '@components/mainPage';

const MapPage: FC = () => {
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
      <div className="absolute w-screen h-screen">
        <Map />
      </div>

      <div className=" w-screen ">
        <div className="absolute top-4 right-4 flex items-center">
          <a className="text-white mr-4">Settings</a>
          <Search />
        </div>
      </div>
    </>
  );
};

export default MapPage;
