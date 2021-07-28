import React, { useEffect } from 'react';
import MapGL, {
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from 'react-map-gl';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

const Map = (): JSX.Element => {
  const [coordinates, setCoordinates] = useState([50, 15]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCoordinates([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  // deafult leaflet url - https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
  const url = `https://api.mapbox.com/styles/v1/${process.env.NEXT_PUBLIC_MAPBOX_USER}/${process.env.NEXT_PUBLIC_MAPBOX_STYLE}/tiles/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  });
  const [popupInfo, setPopupInfo] = useState(null);
  const geolocateStyle = {
    top: 0,
    left: 0,
    padding: '10px',
  };

  const fullscreenControlStyle = {
    top: 36,
    left: 0,
    padding: '10px',
  };

  const navStyle = {
    top: 72,
    left: 0,
    padding: '10px',
  };

  const scaleControlStyle = {
    bottom: 36,
    left: 0,
    padding: '10px',
  };
  return (
    <>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={`mapbox://styles/${process.env.NEXT_PUBLIC_MAPBOX_USER}/${process.env.NEXT_PUBLIC_MAPBOX_STYLE}`}
        onViewportChange={setViewport}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        {popupInfo && (
          <Popup
            tipSize={5}
            anchor="top"
            longitude={50}
            latitude={15}
            closeOnClick={false}
            onClose={setPopupInfo}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas,
            delectus.
          </Popup>
        )}

        <GeolocateControl style={geolocateStyle} />
        <FullscreenControl style={fullscreenControlStyle} />
        <NavigationControl style={navStyle} />
        <ScaleControl style={scaleControlStyle} />
      </MapGL>
    </>
  );
};

export default Map;
