import React, { FC } from 'react';

const Track: FC<{ source: any; target: any; getTrackProps: any }> = ({
  source,
  target,
  getTrackProps,
}) => {
  return (
    <div
      className="absolute bg-blue-500"
      style={{
        height: 10,
        zIndex: 1,
        marginTop: 28,
        borderRadius: 5,
        cursor: 'pointer',
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {
        ...getTrackProps() /* this will set up events if you want it to be clickeable (optional) */
      }
    />
  );
};

export default Track;
