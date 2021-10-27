import React from 'react';
import { SliderItem } from 'react-compound-slider';

const Tick: React.FC<{ tick: SliderItem; count: number }> = ({
  tick,
  count,
}) => {
  return (
    <div>
      <div
        className="absolute bg-white"
        style={{
          marginTop: 20,
          marginLeft: -0.5,
          width: 1,
          height: 8,
          left: `${tick.percent}%`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          marginTop: 5,
          fontSize: 10,
          textAlign: 'center',
          color: 'white',
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${tick.percent}%`,
        }}
      >
        {tick.value}
      </div>
    </div>
  );
};
export default Tick;
