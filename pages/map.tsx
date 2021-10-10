import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import useDarkMode from '@hooks/useDarkmode';
import Image from 'next/image';

import { Search } from 'components/MainPage';
import { MapGL } from 'components/Map';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import { useMapPostsQuery } from '@graphql/geo.graphql';

import { EnumNumberMember } from '@babel/types';

const MapPage: React.FC = () => {
  const { data, loading, error } = useIsLoggedQuery();
  const [bounds, setBounds] = useState<{
    maxLatitude: number;
    minLatitude: number;
    maxLongitude: number;
    minLongitude: number;
  }>({
    maxLatitude: 0,
    minLatitude: 0,
    maxLongitude: 0,
    minLongitude: 0,
  });
  const [points, setPoints] = useState<Array<any>>([]);

  const posts = useMapPostsQuery({ variables: bounds });

  const [searchCoordinates, setSearchCoordinates] = useState({
    lat: 50,
    lng: 15,
  });

  useEffect(() => {
    // filter points from query by point IDs
    const tmp = posts.data?.mapPosts
      ? posts.data.mapPosts.filter(
          (x) => points.find((y) => y.id === x?.id) === undefined
        )
      : [];

    // concat already existing points with new ones
    setPoints([...tmp, ...points]);
  }, [posts.data]);

  useEffect(() => {
    posts.refetch(bounds);
  }, [bounds]);

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
      <div className="w-full" style={{ height: 'calc(100vh - 14px)' }}>
        <MapGL
          searchCoordinates={searchCoordinates}
          setBounds={setBounds}
          points={points}
        />
      </div>
      <Search setSearchCoordinates={setSearchCoordinates} />
    </>
  );
};

export default MapPage;
