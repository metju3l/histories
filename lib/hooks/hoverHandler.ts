import React from 'react';

type hoverHandlerProps = (value: React.SetStateAction<boolean>) => void;

const hoverHandler = (setHover: hoverHandlerProps) => {
  return {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };
};

export default hoverHandler;
