import Head from 'next/head';
import React, { FC } from 'react';

import { Map, Search } from '@components/mainPage';

const MapPage: FC = () => {
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
