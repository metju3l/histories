import { MapContext } from '@src/contexts/MapContext';
import React from 'react';
import { Handles, Rail, Slider, Ticks, Tracks } from 'react-compound-slider';

import { Handle, Tick, Track } from './index';

interface TimelineProps {
  domain: [number, number];
}

const TimeLine: React.FC<TimelineProps> = ({ domain }) => {
  const mapContext = React.useContext(MapContext);

  return (
    <Slider
      rootStyle={{
        position: 'relative',
        width: '100%',
        height: 80,
      }}
      domain={domain}
      step={1}
      mode={2}
      values={domain}
      onUpdate={(limits) =>
        mapContext.setTimeLimitation(limits as [number, number])
      }
    >
      <Rail>
        {({ getRailProps }) => (
          <div
            className="absolute w-full bg-white border border-gray-400"
            style={{
              height: 10,
              marginTop: 28,
              borderRadius: 5,
            }}
            {...getRailProps()}
          />
        )}
      </Rail>
      <Handles>
        {({ handles, getHandleProps }) => (
          <div className="slider-handles">
            {handles.map((handle) => (
              <Handle
                key={handle.id}
                handle={handle}
                getHandleProps={getHandleProps}
              />
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
      <Ticks count={6}>
        {({ ticks }) => (
          <div className="slider-ticks">
            {ticks.map((tick) => (
              <Tick key={tick.id} tick={tick} count={ticks.length} />
            ))}
          </div>
        )}
      </Ticks>
    </Slider>
  );
};

export default TimeLine;
