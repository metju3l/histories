import React, { FC } from 'react';
import MapGL, { GeolocateControl, NavigationControl } from 'react-map-gl';

type Props = {
  viewport: {
    latitude: number;
    longitude: number;
    zoom: number;
    bearing: number;
    pitch: number;
  };
  setViewport: React.Dispatch<
    React.SetStateAction<{
      latitude: number;
      longitude: number;
      zoom: number;
      bearing: number;
      pitch: number;
    }>
  >;
};

const MapLoading: FC<Props> = ({ viewport, setViewport }) => {
  return (
    <>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={`mapbox://styles/${process.env.NEXT_PUBLIC_MAPBOX_USER}/${process.env.NEXT_PUBLIC_MAPBOX_STYLE}`}
        onViewportChange={setViewport}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        dragRotate={false}
      >
        <GeolocateControl
          style={{
            bottom: 128,
            right: 0,
            padding: '10px',
          }}
          positionOptions={{ enableHighAccuracy: true }}
        />
        <NavigationControl
          style={{
            bottom: 32,
            right: 0,
            padding: '10px',
          }}
          showCompass={false}
        />
      </MapGL>
    </>
  );
};

export default MapLoading;
