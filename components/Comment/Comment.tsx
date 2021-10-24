import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import React, { useState } from 'react';
import Image from 'next/image';
import TimeAgo from 'react-timeago';
import { DotsHorizontalIcon } from '@heroicons/react/solid';

const Comment = ({
  content,
  author,
  createdAt,
  logged,
}: {
  content: string;
  author: { firstName: string; lastName: string };
  createdAt: number;
  logged: null | {
    email: string;
    firstName: string;
    lastName: string;
    id: number;
    username: string;
  };
}) => {
  const [mouseOver, setMouseOver] = useState(false);

  return (
    <span
      className="w-full flex flex- gap-2 pl-3"
      onMouseOver={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <div id="userProfile" className="relative rounded-full w-8 h-8">
        <Image
          src={GeneratedProfileUrl(author.firstName, author.lastName)}
          layout="fill"
          objectFit="contain"
          objectPosition="center"
          className="rounded-full"
          alt="Profile picture"
        />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <div
            id="comment"
            className="bg-[#F1F2F4] p-2 rounded-2xl max-w-[210px]"
            style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
          >
            <strong className="font-semibold">
              {author.firstName} {author.lastName}
            </strong>
            <br />
            {content}
          </div>
          {mouseOver && (
            <DotsHorizontalIcon
              id="options"
              className="w-4 h-4 mr-2 rounded-full"
            />
          )}
        </div>

        <span className="pl-2">
          Like · Reply · <TimeAgo date={createdAt} />
        </span>
      </div>
    </span>
  );
};

export default Comment;
