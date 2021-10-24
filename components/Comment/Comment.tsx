import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import React from 'react';
import Image from 'next/image';
import TimeAgo from 'react-timeago';

const Comment = ({
  content,
  author,
  createdAt,
}: {
  content: string;
  author: { firstName: string; lastName: string };
  createdAt: number;
}) => {
  return (
    <span className="w-full flex flex- gap-2 pl-3">
      <div className="relative rounded-full w-8 h-8">
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
        <div
          className="bg-[#F1F2F4] p-2 rounded-2xl max-w-[240px]"
          style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
        >
          <strong className="font-semibold">
            {author.firstName} {author.lastName}
          </strong>
          <br />
          {content}
        </div>

        <span className="pl-2">
          Like · Reply · <TimeAgo date={createdAt} />
        </span>
      </div>
    </span>
  );
};

export default Comment;
