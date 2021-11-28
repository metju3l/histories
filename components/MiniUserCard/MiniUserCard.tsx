import { Button } from '@components/Button';
import hoverHandler from '@hooks/hoverHandler';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
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
  const [nameHover, setNameHover] = useState(false);

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
        <div className="relative flex flex-col">
          <AnimatePresence>
            {nameHover && (
              <ProfilePopup
                setNameHover={setNameHover}
                firstName={firstName}
                lastName={lastName}
                username={username}
              />
            )}
          </AnimatePresence>

          <motion.a
            {...hoverHandler(setNameHover)}
            whileHover={{ textDecoration: 'underline' }}
            className="text-lg font-semibold"
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
      </a>
    </Link>
  );
};

const ProfilePopup: React.FC<{
  firstName: string;
  lastName: string;
  username: string;
  setNameHover: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ firstName, lastName, username, setNameHover }) => {
  return (
    <motion.div
      {...hoverHandler(setNameHover)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: 'easeOut', duration: 0.2 }}
      className="absolute z-40 flex flex-col justify-between h-48 p-4 bg-white border shadow-md -top-48 rounded-2xl w-96 -left-36 border-light-background-tertiary"
    >
      <div className="flex gap-3">
        <div className="relative w-20 h-20 rounded-full cursor-pointer bg-secondary">
          <Image
            src={GeneratedProfileUrl(firstName, lastName)}
            layout="fill"
            objectFit="contain"
            objectPosition="center"
            className="rounded-full"
            alt="Profile picture"
          />
        </div>
        <div className="relative flex flex-col">
          <div className="absolute top-0 left-0"></div>
          <motion.a
            whileHover={{ textDecoration: 'underline' }}
            className="text-2xl font-semibold"
          >
            {firstName} {lastName}
          </motion.a>

          <a className="text-xl cursor-pointer opacity-80">@{username}</a>
        </div>
      </div>
      <div className="flex w-full gap-2">
        <Button isLoading={false}>Follow</Button>
        <Button isLoading={false} backgroundClassname="bg-gray-200 text-black">
          •••
        </Button>
      </div>
    </motion.div>
  );
};

export default Post;
