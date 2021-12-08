import React from 'react';
import { SliderItem } from 'react-compound-slider';

const Tick: React.FC<{ tick: SliderItem; count: number }> = ({
  tick,
  count,
}) => {
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
        <span className="bg-white rounded-xl border border-gray-200 px-2 py-0.5">
          {tick.value}
        </span>
      </div>
    </div>
  );
};
export default Tick;
