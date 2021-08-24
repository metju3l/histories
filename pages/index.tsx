import {
  useCreatePostMutation,
  useDeletePostMutation,
} from '@graphql/post.graphql';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaLanguage, FaRegComment } from 'react-icons/fa';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import useDarkMode from '@hooks/useDarkmode';
import { Navbar } from 'components/Navbar';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BiCollection, BiShare } from 'react-icons/bi';
import { useLikeMutation } from '@graphql/relations.graphql';

const Index = () => {
  const [page, setPage] = useState('feed');
  const { data, loading, error } = useIsLoggedQuery();
  const [createPostMutation] = useCreatePostMutation();
  const [coordinates, setCoordinates] = useState([21, 20]);
  const [marker, setMarker] = useState({
    latitude: 40,
    longitude: -100,
  });
  const [events, logEvents] = useState({});

  const onMarkerDragStart = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }));
  }, []);

  const onMarkerDrag = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }));
  }, []);

  const onMarkerDragEnd = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    });
  }, []);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCoordinates([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  });
  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;

  return (
    <>
      <body>
        {/* @ts-ignore */}
        <Navbar data={data!.isLogged} />
        <div className="flex bg-[#F6F8FA] text-black">
          <div className="h-screen w-[20%] ">col 1</div>
          <div className="h-screen w-[60%] ">Posts </div>
          <div className="h-screen w-[20%] ">contacts</div>
        </div>
      </body>{' '}
    </>
  );
};

export default Index;
