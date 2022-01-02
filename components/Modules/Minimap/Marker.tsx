import React from 'react';
import { Marker } from 'react-map-gl';

import MarkerIcon from './Icons/Marker';

export type MinimapMarkerProps = {
  latitude: number;
  longitude: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const MinimapMarker: React.FC<MinimapMarkerProps> = ({
  latitude,
  longitude,
  onClick,
}) => {
  return (
    <Marker
      latitude={latitude}
      longitude={longitude}
      offsetLeft={-16}
      offsetTop={-16}
    >
      <div className="w-4 h-4" onClick={onClick}>
        <MarkerIcon />
      </div>
    </Marker>
  );
};

export default MinimapMarker;
