import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
import Handle from './Handle';
import Track from './Track';
import Tick from './Tick';

type TimelineProps = {
  domain: [number, number];
  setTimeLimitation: React.Dispatch<React.SetStateAction<[number, number]>>;
};

const TimeLine: React.FC<TimelineProps> = ({ domain, setTimeLimitation }) => {
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
      onUpdate={(limits) => setTimeLimitation(limits as [number, number])}
    >
      <Rail>
        {({ getRailProps }) => (
          <div
            className="absolute w-full bg-gray-600"
            style={{
              height: 10,
              marginTop: 35,
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
      <Ticks count={10}>
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
