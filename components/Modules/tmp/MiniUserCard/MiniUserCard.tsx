import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import TimeAgo from 'react-timeago';

import GeneratedProfileUrl from '../../../../lib/functions/GeneratedProfileUrl';
import hoverHandler from '../../../../lib/hooks/hoverHandler';
import UrlPrefix from '../../../../shared/config/UrlPrefix';
import Button from '../../../Elements/Buttons/Button';

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
      <Link href={'/' + username} passHref>
        <div className="relative w-10 h-10 rounded-full cursor-pointer bg-secondary">
          <Image
            src={profile.startsWith('http') ? profile : UrlPrefix + profile}
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
        <Button>Follow</Button>
        <Button style="primary_outline">•••</Button>
      </div>
    </motion.div>
  );
};

export default Post;
