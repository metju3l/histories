import React from 'react';
import { GetHandleProps, SliderItem } from 'react-compound-slider';

interface HandleProps {
  handle: SliderItem;
  getHandleProps: GetHandleProps;
}

const Handle: React.FC<HandleProps> = ({
  handle: { id, value, percent },
  getHandleProps,
}) => {
  return (
    <div
      className="absolute mt-12 text-white"
      style={{
        left: `${percent}%`,
        marginLeft: -15,
        zIndex: 2,
        width: 30,
        height: 30,
        border: 0,
        textAlign: 'center',
        cursor: 'pointer',
        color: '#333',
      }}
      {...getHandleProps(id)}
    >
      <div className="text-white" style={{ fontSize: 11 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
        {value}
      </div>
    </div>
  );
};

export default Handle;
