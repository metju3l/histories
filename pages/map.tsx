import Head from 'next/head';
import React, { FC, useState } from 'react';

import { Search } from 'components/MainPage';
import { Map } from 'components/Map';

const MapPage: FC = () => {
  const [searchCoordinates, setSearchCoordinates] = useState({
    lat: 50,
    lng: 15,
  });

  return (
    <>
      <Head>
        <title>hiStories</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="hiStories" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="absolute w-screen h-screen">
        <Map searchCoordinates={searchCoordinates} />
      </div>

      <div className=" w-screen ">
        <div className="absolute top-4 right-4 flex items-center">
          <Search setSearchCoordinates={setSearchCoordinates} />
        </div>
      </div>
    </>
  );
};

export default MapPage;
