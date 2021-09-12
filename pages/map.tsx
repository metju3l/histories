import Head from 'next/head';
import React, { FC, useState } from 'react';

import { Search } from 'components/MainPage';
import { Map } from 'components/Map';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import { Navbar } from '@components/Navbar';

const MapPage: FC = () => {
  const { data, loading, error } = useIsLoggedQuery();

  const [searchCoordinates, setSearchCoordinates] = useState({
    lat: 50,
    lng: 15,
  });
  if (loading) return <div></div>;
  if (error) return <div></div>;
  return (
    <>
      <Head>
        <title>hiStories</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="hiStories" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar data={data} />
      <div className="w-full" style={{ height: 'calc(100vh - 14px)' }}>
        <Map searchCoordinates={searchCoordinates} />
      </div>
      <Search setSearchCoordinates={setSearchCoordinates} />
    </>
  );
};

export default MapPage;
