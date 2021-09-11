import {
  useIsLoggedQuery,
  useSuggestedUsersQuery,
} from '@graphql/user.graphql';
import React from 'react';
import { Navbar } from 'components/Navbar';
import Image from 'next/image';

import { IoMdSettings } from 'react-icons/io';
import { MdNotificationsActive, MdPeople } from 'react-icons/md';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { AiFillPlusCircle } from 'react-icons/ai';
import { RiLoginBoxFill } from 'react-icons/ri';

import Link from 'next/link';

const Index = () => {
  const { data, loading, error } = useIsLoggedQuery();
  const suggestedUsers = useSuggestedUsersQuery();

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;
  if (suggestedUsers.data) console.log(suggestedUsers.data);

  return (
    <>
      <body className="bg-[#DADADB]">
        <Navbar data={data} />
        <div className="flex text-black max-w-screen-xl m-auto">
          <div className="w-[30%] p-[1em]">
            <div className="sticky top-20">
              <>
                <div className="w-full h-auto p-[1em] bg-[#343233] rounded-xl">
                  {data!.isLogged && (
                    <Link href={`/${data!.isLogged.username}`}>
                      <a className="flex items-center text-white">
                        <div className="relative rounded-full w-12 h-12 mr-4">
                          <Image
                            src={`https://avatars.dicebear.com/api/initials/${
                              data!.isLogged.firstName
                            }%20${data!.isLogged.lastName}.svg`}
                            layout="fill"
                            objectFit="contain"
                            objectPosition="center"
                            className="rounded-full"
                            alt="Profile picture"
                          />
                        </div>
                        <div className="font-semibold text-lg">
                          {' '}
                          {`${data!.isLogged.firstName} ${
                            data!.isLogged.lastName
                          }`}
                        </div>
                      </a>
                    </Link>
                  )}
                  <div className="flex flex-col text-white ml-3">
                    {data!.isLogged && (
                      <Link href="/createPost">
                        <a className="flex my-3">
                          <AiFillPlusCircle className="mr-4" size={24} />
                          Create post
                        </a>
                      </Link>
                    )}
                    {data!.isLogged && (
                      <a className="flex my-3">
                        <MdNotificationsActive className="mr-4" size={24} />
                        Notifications
                      </a>
                    )}
                    {data!.isLogged && (
                      <Link href="/">
                        <a className="flex my-3">
                          <MdPeople className="mr-4" size={24} />
                          Friends
                        </a>
                      </Link>
                    )}
                    {!data!.isLogged && (
                      <Link href="/login">
                        <a className="flex my-3">
                          <RiLoginBoxFill className="mr-4" size={24} />
                          Log in
                        </a>
                      </Link>
                    )}
                    <Link href="/map">
                      <a className="flex my-3">
                        <FaMapMarkedAlt className="mr-4" size={24} />
                        Map
                      </a>
                    </Link>
                    <Link href="/settings">
                      <a className="flex my-3">
                        <IoMdSettings className="mr-4" size={24} />
                        Settings
                      </a>
                    </Link>
                  </div>
                </div>
              </>
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
                {data!.isLogged ? (
                  suggestedUsers.data?.suggestedUsers ? (
                    <>
                      <h2 className="text-center font-semibold text-lg">
                        People you might know
                      </h2>
                      <div className="flex flex-col text-white ml-2 mt-6">
                        {suggestedUsers!.data!.suggestedUsers.map(
                          (user, index) => {
                            return (
                              <div
                                className="flex items-center mb-6"
                                key={index}
                              >
                                <Link href={`/${user!.username}`}>
                                  <a className="relative rounded-full w-12 h-12 mr-4">
                                    <Image
                                      src={`https://avatars.dicebear.com/api/initials/${
                                        user!.firstName
                                      }%20${user!.lastName}.svg`}
                                      layout="fill"
                                      objectFit="contain"
                                      objectPosition="center"
                                      className="rounded-full"
                                      alt="Profile picture"
                                    />
                                  </a>
                                </Link>
                                <div>
                                  <Link href={`/${user!.username}`}>
                                    {`${user!.firstName} ${user!.lastName}`}
                                  </Link>
                                  <br />
                                  <button className="bg-[#2D89FE] px-4 py-1 mt-1 rounded-xl">
                                    Follow
                                  </button>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </>
                  ) : (
                    <div>loading</div>
                  )
                ) : (
                  <PopularPeople />
                )}
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

const PopularPeople = () => {
  return (
    <>
      <h2 className="text-center font-semibold text-lg">Popular people</h2>
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
