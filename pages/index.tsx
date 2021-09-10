import { useCreatePostMutation } from '@graphql/post.graphql';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import React, { useEffect, useState } from 'react';
import { Navbar } from 'components/Navbar';
import Image from 'next/image';

import LeftColumn from '@components/MainPage/LeftColumn';

import { FaMapMarkedAlt } from 'react-icons/fa';
import Link from 'next/link';

const Index = () => {
  const { data, loading, error } = useIsLoggedQuery();
  const [createPostMutation] = useCreatePostMutation();
  const [coordinates, setCoordinates] = useState([21, 20]);
  const [marker, setMarker] = useState({
    latitude: 40,
    longitude: -100,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCoordinates([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;

  return (
    <>
      <body className="bg-[#DADADB]">
        {/* @ts-ignore */}
        <Navbar data={data!.isLogged} />
        <div className="flex text-black max-w-screen-xl m-auto">
          <div className="w-[30%] p-[1em]">
            <div className="sticky top-20">
              <LeftColumn />
            </div>
          </div>
          <div className="w-[40%] p-[1em] mt-2">
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
          </div>
          {/* RIGHT COLUMN */}
          <div className="w-[30%] p-[1em]">
            <div className="sticky top-20">
              <div className="w-full p-[1em] bg-[#343233] rounded-xl text-white mb-8 ">
                <FriendSuggestions />
              </div>
            </div>
          </div>
        </div>
      </body>{' '}
    </>
  );
};

const Post = () => {
  return (
    <div className="w-full p-[1em] rounded-xl text-white bg-[#343233] mb-8">
      <div className="flex items-center text-white">
        <div className="relative rounded-full w-12 h-12 mr-4">
          <Image
            src={`https://avatars.dicebear.com/api/initials/${'John'}%20${'Doe'}.svg`}
            layout="fill"
            objectFit="contain"
            objectPosition="center"
            className="rounded-full"
            alt="Profile picture"
          />
        </div>
        <div className="font-semibold text-lg"> John Doe</div>
      </div>
      <div className="relative rounded-xl w-full h-[16em] mt-8">
        <Image
          src={`https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80`}
          layout="fill"
          objectFit="contain"
          objectPosition="center"
          className="rounded-xl"
          alt="Profile picture"
        />
        <div className="text-white absolute right-4 bottom-2 p-2 bg-[#343233] rounded-xl">
          <Link href="/map">
            <a>
              <FaMapMarkedAlt size={24} />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

const FriendSuggestions = () => {
  return (
    <>
      <h2 className="text-center font-semibold text-lg">
        People you might know
      </h2>
      <div className="flex flex-col text-white ml-2 mt-6">
        {Array.from(new Array(4), (_, i) => (
          <div className="flex items-center mb-6">
            <div className="relative rounded-full w-12 h-12 mr-4">
              <Image
                src={`https://avatars.dicebear.com/api/initials/${'John'}%20${'Doe'}.svg`}
                layout="fill"
                objectFit="contain"
                objectPosition="center"
                className="rounded-full"
                alt="Profile picture"
              />
            </div>
            <div>
              John Doe
              <br />
              <button className="bg-[#2D89FE] px-4 py-1 mt-1 rounded-xl">
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Index;
