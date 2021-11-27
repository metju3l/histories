import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import TimeAgo from 'react-timeago';

import GeneratedProfileUrl from '../../lib/functions/GeneratedProfileUrl';

export type MiniUserCardProps = {
  firstName: string;
  lastName: string;
  username: string;
  time?: number;
};

const Post: React.FC<MiniUserCardProps> = ({
  firstName,
  lastName,
  username,
  time,
}) => {
  return (
    <Link href={'/' + username}>
      <a className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full cursor-pointer bg-secondary">
          <Image
            src={GeneratedProfileUrl(firstName, lastName)}
            layout="fill"
            objectFit="contain"
            objectPosition="center"
            className="rounded-full"
            alt="Profile picture"
          />
        </div>
        <div className="flex flex-col">
          <a className="text-lg font-semibold">
            {firstName} {lastName}
          </a>

          <a className="cursor-pointer opacity-80">
            @{username}
            {time && (
              <>
                {' · '}
                <TimeAgo date={time} />
              </>
            )}
          </a>
        </div>
      </a>
    </Link>
  );
};

export default Post;
