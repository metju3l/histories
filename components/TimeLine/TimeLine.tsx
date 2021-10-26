import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
import Handle from './Handle';
import Track from './Track';
import Tick from './Tick';

const TimeLine = ({
  timeLimitation,
  setTimeLimitation,
}: {
  timeLimitation: [number, number];
  setTimeLimitation: any;
}) => {
  const domain = [0, 2020];

  return (
    <Slider
      rootStyle={{
        position: 'relative',
        width: '600px',
        height: 80,
      }}
      domain={domain}
      step={1}
      mode={2}
      values={domain}
      onUpdate={(e) => setTimeLimitation(e)}
    >
      <Rail>
        {({ getRailProps }) => (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: 10,
              marginTop: 35,
              borderRadius: 5,
              backgroundColor: '#8B9CB6',
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
      <Ticks count={5}>
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
