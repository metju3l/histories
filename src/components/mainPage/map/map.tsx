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
        <Source
          id="my-data"
          type="geojson"
          data={{
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: JSON.parse(paths.data!.paths!.coordinates),
            },
            properties: {
              id: '057594A7321C25382DD0',
              name: 'tripToSchool',
            },
          }}
        >
          <Layer
            {...{
              id: 'point',
              type: 'line',
              paint: {
                'line-color': '#ff9900',
              },
            }}
          />
        </Source>

        <GeolocateControl
          style={{
            bottom: 128,
            right: 0,
            padding: '10px',
          }}
          positionOptions={{ enableHighAccuracy: true }}
        />

        <Marker key={1} latitude={50.089748} longitude={14.3984}>
          🏰
        </Marker>

        <NavigationControl
          style={{
            bottom: 36,
            right: 0,
            padding: '10px',
          }}
        />
        <ScaleControl style={{ bottom: 18, right: 0 }} />
      </MapGL>
    </>
  );
};

export default Map;
