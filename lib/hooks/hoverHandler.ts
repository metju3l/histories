import React from 'react';

type setHoverType = React.Dispatch<React.SetStateAction<boolean>>;

const hoverHandler = (setHover: setHoverType) => {
  return {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };
};

export default hoverHandler;
