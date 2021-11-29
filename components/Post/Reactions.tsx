import hoverHandler from '@hooks/hoverHandler';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

const Reaction: React.FC<{
  text: string;
  tooltip: string;
  onClick: (type: string) => void;
}> = ({ children, onClick, text, tooltip }) => {
  const [hover, setHover] = useState(false);

  return (
    <>
      <motion.button
        {...hoverHandler(setHover)}
        initial={{ y: '40px', opacity: 0.4 }}
        animate={{ y: '0', opacity: 1 }}
        exit={{ y: '40px', opacity: 0.4 }} // dissapear animation
        whileHover={{ scale: 1.4 }} // scale on hover
        transition={{ ease: 'easeOut', duration: 0.1 }}
        onClick={async () => await onClick(text)}
      >
        {/* TOOLTIP */}
        {hover && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
            className="absolute px-3 py-1 text-sm text-white bg-black rounded-full -top-6 left-[1.85rem] -translate-x-1/2"
          >
            {tooltip}
          </motion.div>
        )}
        {/* ICON */}
        {children}
      </motion.button>
    </>
  );
};

export const ReactionMenu: React.FC<{
  onLike: (type: string) => Promise<void>;
}> = ({ onLike }) => {
  return (
    <motion.div
      initial={{ opacity: 0.1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: 'easeOut', duration: 0.1 }}
      className="absolute px-4 ml-4 text-4xl bg-white border rounded-full shadow-lg -top-8  left-8 border-light-background-tertiary"
    >
      <Reaction text="👍" tooltip="like" onClick={onLike}>
        👍
        {/* <Image src={Like} height={60} width={60} alt="haha" /> */}
      </Reaction>
      <Reaction text="❤" tooltip="love" onClick={onLike}>
        ❤{/* <Image src={Love} height={60} width={60} alt="haha" /> */}
      </Reaction>
      <Reaction text="😆" tooltip="haha" onClick={onLike}>
        😆
        {/* <Image src={Haha} height={60} width={60} alt="haha" /> */}
      </Reaction>
      <Reaction text="😲" tooltip="wow" onClick={onLike}>
        😲
        {/* <Image src={Wow} height={60} width={60} alt="haha" /> */}
      </Reaction>
      <Reaction text="😠" tooltip="angry" onClick={onLike}>
        😠
        {/* <Image src={Angry} height={60} width={60} alt="haha" /> */}
      </Reaction>
    </motion.div>
  );
};
