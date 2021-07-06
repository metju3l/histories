import Head from 'next/head';
import { NextPageContext } from 'next';
import React from 'react';
import { useGetUserInfoQuery } from '../../src/graphql/getUserInfo.graphql';
import { Post, Map, Search } from '../../src/components/mainPage';
import { IoIosArrowBack } from 'react-icons/io';

const user = ({ username }: { username: string }) => {
  const { data, loading, error } = useGetUserInfoQuery({
    variables: { username: username },
  });

  if (error) return <div>error</div>;
  if (loading) return <div>loading</div>;
  if (data?.getUserInfo === null) return <div>user does not exist</div>;

  return (
    <>
      <Head>
        <title>hiStories</title>
        <meta name="description" content="hiStories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute w-screen h-screen">
        <Map />
      </div>

      <div className="flex w-screen">
        <div className="p-4 left-0 top-0 w-1/2 max-w-sidebar"></div>
        <div className="absolute p-4 left-0 top-0 w-1/2 max-w-sidebar h-screen">
          <div className="bg-white bg-opacity-80 w-full h-full rounded-lg p-2 ">
            <div className=" overflow-y-scroll scrollbar-hide overflow-x-hidden h-content">
              <div className=" w-full">
                <div className="flex">
                  <div className="bg-black h-20 w-20 rounded-full"></div>
                  <div className="ml-10 mt-4">
                    {data?.getUserInfo?.followers?.length} <br />
                    followers
                  </div>
                  <div className="ml-10 mt-4">
                    {data?.getUserInfo?.following?.length} <br />
                    following
                  </div>
                </div>
                <div className="text-2xl">
                  {`${data?.getUserInfo?.firstName} 
                  ${data?.getUserInfo?.lastName}`}
                </div>
                <div className="text-gray-500">
                  @{data?.getUserInfo?.username}
                </div>
              </div>
              <Post
                username="czM1K3"
                url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
              />
              <Post
                username="kahy9"
                url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
              />
              <Post
                username="krystofex"
                url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
              />
              <Post
                username="kewin"
                url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
              />
            </div>
          </div>
        </div>
        <div className="flex z-10 h-10 mt-4">
          <IoIosArrowBack
            className="bg-opacity-80 bg-white rounded-lg text-black h-10 w-10 p-2"
            size={8}
          />
        </div>
        <div className="flex z-10 h-10 ml-4 mt-4">
          <Search />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  return {
    props: {
      // @ts-ignore
      username: context.query.username.toString(),
    },
  };
};

export default user;
