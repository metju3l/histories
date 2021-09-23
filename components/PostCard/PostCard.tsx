import Link from 'next/link';
import React, { FC, useState } from 'react';
import { useDeletePostMutation, usePostQuery } from '@graphql/post.graphql';
import { useLikeMutation } from '@graphql/relations.graphql';
import { BiShare, BiCollection } from 'react-icons/bi';
import { FaMapMarkedAlt, FaRegComment } from 'react-icons/fa';
import { HiOutlineHeart, HiOutlineLocationMarker } from 'react-icons/hi';
import Image from 'next/image';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import { Button } from '@nextui-org/react';
import Router from 'next/router';
import { toast } from 'react-hot-toast';

const PostCard: FC<{
  isLoggedQuery: any;
  id: number;
  refetch: any;
}> = ({ id, isLoggedQuery, refetch }) => {
  const { data, loading, error } = usePostQuery({ variables: { id } });

  const [deletePostMutation] = useDeletePostMutation();
  const [likeMutation] = useLikeMutation();
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (loading) return <div>loading</div>;
  if (error) {
    console.log(error);

    return <div>error</div>;
  }

  const time = new Date(parseInt(data!.post.createdAt)).toLocaleDateString(
    'cs-cz',
    {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }
  );

  return (
    <div className="w-[75%] m-auto p-[1em] bg-white shadow-lg dark:bg-[#343233] rounded-xl text-text-light dark:text-white mb-8">
      <div className="flex items-center">
        <Link href={`/${data!.post.author.username}`}>
          <a className="flex">
            <div className="relative rounded-full w-12 h-12 mr-4">
              <Image
                src={GeneratedProfileUrl(
                  data!.post.author.firstName,
                  data!.post.author.lastName
                )}
                layout="fill"
                objectFit="contain"
                objectPosition="center"
                className="rounded-full"
                alt="Profile picture"
              />
            </div>
            <a>
              <div className="font-semibold text-lg">
                {' '}
                {data!.post.author.firstName} {data!.post.author.lastName}
              </div>
            </a>
          </a>
        </Link>
      </div>
      {isLoggedQuery?.data?.isLogged?.id === data!.post.author.id && (
        <div
          onClick={async (values) => {
            setIsLoading(true);
            try {
              await deletePostMutation({
                variables: { id },
              });
            } catch (error) {
              // @ts-ignore
              toast.error(error.message);
            }
            setIsLoading(false);
          }}
        >
          {isLoading ? (
            <Button loading loaderType="spinner" />
          ) : (
            <Button type="submit" color="error">
              delete post
            </Button>
          )}
        </div>
      )}
      {time}
      <br />
      {data?.post.description}
      {data?.post.hashtags && (
        <div>
          hashtags:
          {data!.post.hashtags.map((hashtag: any) => (
            <Button key={hashtag} auto flat color="#ff4ecd">
              {hashtag}
            </Button>
          ))}
        </div>
      )}
      <div className="relative rounded-xl w-full h-[16em] mt-8">
        <Image
          src={`https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80`}
          layout="fill"
          objectFit="contain"
          objectPosition="center"
          className="rounded-xl"
          alt="Profile picture"
        />
        <div className="absolute right-2 bottom-4 p-2 bg-white shadow-lg dark:bg-[#343233] rounded-xl text-text-light dark:text-white">
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

export default PostCard;
