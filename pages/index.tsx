import 'tailwindcss/tailwind.css';
import Head from 'next/head';
import React, { useMemo, useState } from 'react';

const Home = () => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      // @ts-ignore
      setStatus('Geolocation is not supported by your browser');
    } else {
      // @ts-ignore
      setStatus('Locating...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus(null);
          // @ts-ignore
          setLat(position.coords.latitude);
          // @ts-ignore
          setLng(position.coords.longitude);
        },
        () => {
          // @ts-ignore
          setStatus('Unable to retrieve your location');
        }
      );
    }
  };

  return (
    <div className="App">
      <button onClick={getLocation}>Get Location</button>
      <h1>Coordinates</h1>
      <p>{status}</p>
      {lat && <p>Latitude: {lat}</p>}
      {lng && <p>Longitude: {lng}</p>}
    </div>
  );
};

export default Home;
