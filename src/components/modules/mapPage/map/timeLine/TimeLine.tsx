import { MapContext } from '@src/contexts/MapContext';
import React from 'react';
import { Handles, Rail, Slider, Ticks, Tracks } from 'react-compound-slider';

import { Tick, Track } from './index';

interface TimelineProps {
  domain: [number, number];
}

const TimeLine: React.FC<TimelineProps> = ({ domain }) => {
  const mapContext = React.useContext(MapContext);

  return (
    <Slider
      vertical
      reversed
      mode={3}
      rootStyle={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
      domain={domain}
      step={1}
      values={mapContext.timeLimitation}
      onUpdate={(limits) =>
        mapContext.setTimeLimitation(limits as [number, number])
      }
    >
      <Rail>
        {({ getRailProps }) => (
          <div
            className="absolute rounded h-full w-2 bg-white border border-gray-400"
            {...getRailProps()}
          />
        )}
      </Rail>
      <Handles>
        {({ handles, getHandleProps }) => (
          <div className="slider-handles">
            {handles.map(({ id, value, percent }) => (
              <div
                key={id}
                className={`absolute px-2 cursor-pointer py-1 border border-gray-400 bg-white text-black text-xs rounded-xl -translate-x-1/2 z-20`}
                style={{
                  top: `${percent}%`,
                }}
                {...getHandleProps(id)}
              >
                {value}
              </div>
            ))}
          </div>
        )}
      </Handles>
      <Tracks left={false} right={false}>
        {({ tracks, getTrackProps }) => (
          <div className="slider-tracks">
            {tracks.map(({ id, source, target }) => (
              <Track
                key={id}
                source={source}
                target={target}
                getTrackProps={getTrackProps}
              />
            ))}
          </div>
        )}
      </Tracks>
      {/*   <Ticks count={6}>
        {({ ticks }) => (
          <div className="slider-ticks">
            {ticks.map((tick) => (
              <Tick key={tick.id} tick={tick} count={ticks.length} />
            ))}
          </div>
        )}
      </Ticks>
      */}
    </Slider>
  );
};

export default TimeLine;
