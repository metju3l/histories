import 'tailwindcss/tailwind.css';
import Head from 'next/head';
import React, { useMemo, useState } from 'react';

const Home = () => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      // @ts-ignore
      setStatus('Geolocation is not supported by your browser');
    } else {
      // @ts-ignore
      setStatus('Locating...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus(null);
          // @ts-ignore
          setLat(position.coords.latitude);
          // @ts-ignore
          setLng(position.coords.longitude);
        },
        () => {
          // @ts-ignore
          setStatus('Unable to retrieve your location');
        }
      );
    }
  };

  return (
    <>
      <Head>
        <title>hiStories</title>
        <meta name="description" content="hiStories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-screen h-screen bg-blue-100"></div>
      <div className="absolute left-0 top-0 z-10 h-screen w-2/5 py-4 pl-4">
        <div className="bg-white w-full min-h-full rounded-widget p-2">
          <div className="flex">
            <div className="rounded-full w-10 h-10 bg-yellow"></div>
            <div className="bg-gray-500 h-10 w-full">search</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
