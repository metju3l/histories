import { IViewport } from '@lib/types/map';
import React, { useState } from 'react';
import ReactMapGL from 'react-map-gl';

import Marker from './Marker';

export type MinimapProps = {
  coordinates: [number, number];
};

const Minimap: React.FC<MinimapProps> = ({ coordinates }) => {
  const [viewport, setViewport] = useState<IViewport>({
    latitude: coordinates[0],
    longitude: coordinates[1],
    zoom: 9,
    bearing: 0,
    pitch: 0,
  });

  return (
    <ReactMapGL
      {...viewport}
      {...{
        width: '100%',
        height: '100%',
        className: 'rounded-lg',
        mapStyle: 'mapbox://styles/mapbox/streets-v11', // MAPBOX STYLE
        mapboxApiAccessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN, // MAPBOX API ACCESS TOKEN
      }}
      onViewportChange={setViewport}
    >
      <Marker
        latitude={coordinates[0]}
        longitude={coordinates[1]}
        onClick={
          // on click set viewport to marker location
          () =>
            setViewport({
              latitude: coordinates[0],
              longitude: coordinates[1],
              zoom: 14,
              bearing: 0,
              pitch: 0,
            })
        }
      />
    </ReactMapGL>
  );
};

export default Minimap;
