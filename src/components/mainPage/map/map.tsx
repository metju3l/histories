import React, { useEffect } from 'react';
import MapGL, {
  Marker,
  NavigationControl,
  ScaleControl,
  GeolocateControl,
  Source,
  Layer,
} from 'react-map-gl';
import { useState } from 'react';
import { usePathsQuery } from '../../../graphql/getUserInfo.graphql';

const Map = (): JSX.Element => {
  const paths = usePathsQuery();
  const [coordinates, setCoordinates] = useState([21, 20]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCoordinates([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  });

  if (paths.loading) return <div>loading...</div>;
  if (paths.error) return <div>error...</div>;

  const pathColors = [
    '#00ff95',
    '#ed315d',
    '#43bccd',
    '#ffb647',
    '#555eb4',
    '#ff5964',
    '#a572d5',
  ];

  const Paths = paths.data!.paths!.map((path, key) => {
    return (
      <Source
        key={key}
        id={key.toString()}
        type="geojson"
        data={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: JSON.parse(path!.coordinates),
          },
          properties: {
            id: key.toString(),
            name: path?.name,
          },
        }}
      >
        <Layer
          {...{
            id: key.toString(),
            type: 'line',
            paint: {
              'line-color': pathColors[key % pathColors.length],
            },
          }}
        />
      </Source>
    );
  });

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
        {Paths}
        <Marker key={1} latitude={50.089748} longitude={14.3984}>
          🏰
        </Marker>
      </MapGL>
    </>
  );
};

export default Map;
