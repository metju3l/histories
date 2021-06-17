import 'tailwindcss/tailwind.css';
import Head from 'next/head';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';

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
        <div className="bg-white w-full h-full rounded-widget p-2">
          <div className="flex">
            <div className="rounded-full w-auto pt-2 h-10 bg-yellow">LOGO</div>

            <input
              className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
            />

            <BiSearchAlt2 size={36} />
          </div>
          <div className="overflow-y-scroll overflow-x-hidden h-content">
            <img src="https://images.unsplash.com/photo-1513074255137-9986519d8b97?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" />
            <img src="https://images.unsplash.com/photo-1541351194462-30fd68e56644?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=670&q=80" />
            <img src="https://images.unsplash.com/photo-1612007699790-c68cae70c176?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=601&q=80" />
            <img src="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
