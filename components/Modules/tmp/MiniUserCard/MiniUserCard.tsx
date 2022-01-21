import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import TimeAgo from 'react-timeago';

import UrlPrefix from '../../../../shared/config/UrlPrefix';

export type MiniUserCardProps = {
  firstName: string;
  lastName: string;
  username: string;
  time?: number;
  profile: string;
};

const Post: React.FC<MiniUserCardProps> = ({
  firstName,
  lastName,
  username,
  time,
  profile,
}) => {
  const [nameHover, setNameHover] = useState(false);

  let timer: any;

  return (
    <div className="flex items-center gap-3">
      <Link href={'/user/' + username} passHref>
        <div className="relative w-10 h-10 rounded-full cursor-pointer bg-secondary">
          <Image
            src={profile.startsWith('http') ? profile : UrlPrefix + profile}
            loading='eager'
            layout="fill"
            objectFit="contain"
            objectPosition="center"
            className="rounded-full"
            alt="Profile picture"
          />
        </div>
      </Link>
      <div
        className="relative flex flex-col"
        onMouseLeave={() => setNameHover(false)}
      >
        <motion.a
          onMouseEnter={() => {
            timer = setTimeout(() => setNameHover(true), 1000);
          }}
          onMouseLeave={() => {
            clearTimeout(timer);
            setNameHover(false);
          }}
          whileHover={{ textDecoration: 'underline' }}
          className="text-lg font-semibold cursor-pointer"
        >
          {firstName} {lastName}
        </motion.a>

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
    </div>
  );
};

export default Post;
