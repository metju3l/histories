import React, {
  useEffect,
  Component,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { BsGeoAlt } from 'react-icons/bs';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

const Map = () => {
  const [coordinates, setCoordinates] = useState([50, 15]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCoordinates([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  return (
    <>
      <MapContainer
        center={coordinates}
        zoom={15}
        minZoom={3}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={true}
        className="z-0"
      >
        <TileLayer
          // @ts-ignore
          attribution="<a href='https://github.com/krystofex/hiStories'>hiStories</a>"
          url={`https://api.mapbox.com/styles/v1/${process.env.NEXT_PUBLIC_MAPBOX_USER}/${process.env.NEXT_PUBLIC_MAPBOX_STYLE}/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
        />
        <ZoomControl position="bottomright" />
      </MapContainer>
      <button className="absolute z-50 top-10 right-10">
        <BsGeoAlt />
      </button>
    </>
  );
};

export default Map;
