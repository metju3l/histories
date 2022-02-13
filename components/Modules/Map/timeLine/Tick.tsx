import React from 'react';
import { SliderItem } from 'react-compound-slider';

interface TickProps {
  tick: SliderItem;
  count: number;
}

const Tick: React.FC<TickProps> = ({ tick, count }) => {
  return (
    <div>
      <div
        style={{
          position: 'absolute',
          marginTop: 5,
          fontSize: 10,
          textAlign: 'center',
          color: 'black',
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${tick.percent}%`,
        }}
      >
        <span className="px-2 bg-white border border-gray-200 rounded-xl py-0.5">
          {tick.value}
        </span>
      </div>
    </div>
  );
};
export default Tick;
