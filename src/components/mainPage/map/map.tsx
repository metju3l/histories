import React, { useEffect } from 'react';

import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

const Map = () => {
  const [coordinates, setCoordinates] = useState([50, 15]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCoordinates([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  // deafult leaflet url - https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
  const url = `https://api.mapbox.com/styles/v1/${process.env.NEXT_PUBLIC_MAPBOX_USER}/${process.env.NEXT_PUBLIC_MAPBOX_STYLE}/tiles/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

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
          url={url}
        />
        <ZoomControl position="bottomright" />
      </MapContainer>
    </>
  );
};

export default Map;
