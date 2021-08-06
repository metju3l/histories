import Link from 'next/link';
import React, { FC, useState } from 'react';
import { useDeletePostMutation } from '@graphql/post.graphql';

import { BiShare, BiCollection } from 'react-icons/bi';
import { FaRegComment } from 'react-icons/fa';
import { HiOutlineHeart, HiOutlineLocationMarker } from 'react-icons/hi';

const Post: FC<{
  key: number;
  url: string;
  username: string;
  description: string | null | undefined;
  createdAt: string;
  isLoggedQuery: any;
  data: any;
  post: any;
}> = ({
  url,
  username,
  key,
  description,
  createdAt,
  isLoggedQuery,
  data,
  post,
}) => {
  const time = new Date(parseInt(createdAt)).toLocaleDateString('cs-cz', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const [deletePostMutation] = useDeletePostMutation();
  const [editMode, setEditMode] = useState(false);
  return (
    <div
      key={key}
      className="w-full p-4 mb-12 rounded-2xl text-white"
      style={{ backgroundColor: '#242526' }}
    >
      {isLoggedQuery.data?.isLogged?.userID === data.getUserInfo.username ? (
        <>
          {editMode ? (
            <button onClick={() => setEditMode(false)}>leave edit</button>
          ) : (
            <button onClick={() => setEditMode(true)}>edit</button>
          )}
          <br />
          <button
            onClick={async () => {
              try {
                await deletePostMutation({
                  variables: { postID: post.postID },
                });
              } catch (error) {
                console.log(error.message);
              }
            }}
          >
            delete post
          </button>
        </>
      ) : (
        ''
      )}

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
      <div className="w-full mt-14 mb-4 text-white">
        {!editMode ? description : <input className="text-black" type="text" />}
      </div>
      {time}
      <img className="w-full rounded-lg" src={url} alt="post from userxxx" />
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
    </div>
  );
};

export default Post;
