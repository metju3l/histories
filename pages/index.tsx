import 'tailwindcss/tailwind.css';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import { BiShare, BiCollection } from 'react-icons/bi';
import { FaRegComment } from 'react-icons/fa';
import { HiOutlineHeart, HiOutlineLocationMarker } from 'react-icons/hi';

const DynamicMap = () => {
  const DynamicMap = dynamic(
    () => import('../src/components/map'), // replace '@components/map' with your component's location
    { ssr: false } // This line is important. It's what prevents server-side render
  );
  return <DynamicMap />;
};

const Img = ({ url, username }: { url: string; username: string }) => {
  return (
    <div className="w-full p-4 mb-12 border-t-2 border-gray-50">
      <div className="w-full">
        <div className="float-left flex">
          <div className="h-10 w-10 bg-gray-600 rounded-full mb-4"></div>
          <Link href={`/${username}`}>
            <a className="pl-2 pt-1.5 text-blue-500 ">{username}</a>
          </Link>
        </div>
        <div className="float-right pt-1.5">
          <Link href="/">
            <a className="text-blue-500 flex">
              <HiOutlineLocationMarker size={24} className="mx-2" />
              Pardubice hlavní nádraží
            </a>
          </Link>
        </div>
      </div>
      <img className="w-full rounded-lg" src={url} />

      <div className="w-full h-12 pt-2">
        <div className="flex float-left">
          <HiOutlineHeart size={36} className="mr-2" />
          <FaRegComment size={32} className="mx-2" />
          <BiShare size={36} className="mx-2" />
        </div>
        <div className="float-right">
          <BiCollection size={36} className="mx-2" />
        </div>
      </div>
      <div className="w-full">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
        debitis accusamus quaerat laudantium ducimus delectus quibusdam
        praesentium laborum quasi eos?
      </div>
    </div>
  );
};

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
          <div className="overflow-y-scroll scrollbar-hide overflow-x-hidden h-content">
            <Img
              username="czM1K3"
              url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
            />
            <Img
              username="kahy9"
              url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
            />
            <Img
              username="krystofex"
              url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
            />
            <Img
              username="kewin"
              url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
            />
          </div>
        </div>
        <DynamicMap />
      </div>
    </>
  );
};

export default Home;
