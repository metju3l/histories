import React, { FC, useEffect, useState } from 'react';
import MapGL, {
  Marker,
  NavigationControl,
  ScaleControl,
  GeolocateControl,
  Source,
  Layer,
} from 'react-map-gl';
import { usePathsQuery } from '@graphql/geo.graphql';
import MapLoading from './MapLoading';
import LayerIcon from '@public/mapLayerIcon.png';
import Image from 'next/image';
import { TimeLine } from '@components/TimeLine/index';

const Map: FC = () => {
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

  if (paths.loading)
    return <MapLoading viewport={viewport} setViewport={setViewport} />;
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

  const Paths = paths.data!.paths!.map((path: any, index: number) => {
    return (
      <Source
        key={index}
        id={index.toString()}
        type="geojson"
        data={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: JSON.parse(path!.coordinates.replace(/\n/g, '')),
          },
          properties: {
            id: index,
            name: path?.name,
          },
        }}
      >
        <Layer
          {...{
            id: index.toString(),
            type: 'line',
            paint: {
              'line-color': pathColors[index % pathColors.length],
            },
          }}
        />
      </Source>
    );
  });

  return (
    <>
      <div className="absolute top-0 left-10" style={{ zIndex: 100 }}>
        <TimeLine />
      </div>
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
            bottom: 186,
            right: 0,
            padding: '10px',
          }}
          positionOptions={{ enableHighAccuracy: true }}
        />
        <NavigationControl
          style={{
            bottom: 240,
            right: 0,
            padding: '10px',
          }}
          showCompass={false}
        />
        {Paths}
        <Marker key={1} latitude={50.089748} longitude={14.3984}>
          🏰
        </Marker>
        <div className="absolute bottom-28 right-2 bg-white rounded-md">
          <Image src={LayerIcon} width={32} height={32} alt="alt" />
        </div>
      </MapGL>
    </>
  );
};

export default Map;
