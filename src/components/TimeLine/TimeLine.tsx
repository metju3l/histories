import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';

const TimeLine = () => {
  return (
    <Slider
      rootStyle={{
        position: 'relative',
        width: '600px',
        height: 80,
      }}
      domain={[0, 100]}
      step={1}
      mode={2}
      values={[10, 70]}
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
              <div
                key={handle.id}
                style={{
                  left: `${handle.percent}%`,
                  position: 'absolute',
                  marginLeft: -15,
                  marginTop: 25,
                  zIndex: 2,
                  width: 30,
                  height: 30,
                  border: 0,
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  backgroundColor: '#2C4870',
                  color: '#333',
                }}
                {...getHandleProps(handle.id)}
              >
                <div
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: 11,
                    marginTop: -35,
                  }}
                >
                  {handle.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </Handles>
      <Tracks left={false} right={false}>
        {({ tracks, getTrackProps }) => (
          <div className="slider-tracks">
            {tracks.map(({ id, source, target }) => (
              <div
                key={id}
                style={{
                  position: 'absolute',
                  height: 10,
                  zIndex: 1,
                  marginTop: 35,
                  backgroundColor: '#546C91',
                  borderRadius: 5,
                  cursor: 'pointer',
                  left: `${source.percent}%`,
                  width: `${target.percent - source.percent}%`,
                }}
                {
                  ...getTrackProps() /* this will set up events if you want it to be clickeable (optional) */
                }
              />
            ))}
          </div>
        )}
      </Tracks>
      <Ticks count={10}>
        {({ ticks }) => (
          <div className="slider-ticks">
            {ticks.map((tick) => (
              <div key={tick.id}>
                <div
                  style={{
                    position: 'absolute',
                    marginTop: 52,
                    marginLeft: -0.5,
                    width: 1,
                    height: 8,
                    backgroundColor: 'silver',
                    left: `${tick.percent}%`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    marginTop: 60,
                    fontSize: 10,
                    textAlign: 'center',
                    marginLeft: `${-(100 / ticks.length) / 2}%`,
                    width: `${100 / ticks.length}%`,
                    left: `${tick.percent}%`,
                  }}
                >
                  {tick.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </Ticks>
    </Slider>
  );
};

export default TimeLine;
