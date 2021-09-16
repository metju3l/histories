import React, { useEffect, useRef, useState } from 'react';
import ReactMapGL, {
  Marker,
  NavigationControl,
  GeolocateControl,
  Source,
  FlyToInterpolator,
  Layer,
} from 'react-map-gl';
import { usePathsQuery } from '@graphql/geo.graphql';
import MapLoading from './MapLoading';
import LayerIcon from '@public/mapLayerIcon.png';
import Image from 'next/image';
import { TimeLine } from 'components/TimeLine/index';

const Map = ({ searchCoordinates }: any): JSX.Element => {
  const [coordinates, setCoordinates] = useState([21, 20]);

  const paths = usePathsQuery();

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

  const pathColors = [
    '#00ff95',
    '#ed315d',
    '#43bccd',
    '#ffb647',
    '#555eb4',
    '#ff5964',
    '#a572d5',
  ];
  useEffect(() => {
    setViewport({
      ...viewport,
      longitude: searchCoordinates.lng,
      latitude: searchCoordinates.lat,
      zoom: 14,
      // @ts-ignore
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  }, [searchCoordinates]); // eslint-disable-line react-hooks/exhaustive-deps

  const mapRef = useRef<any>(null);

  if (paths.loading) return <div>loading</div>;
  if (paths.error) return <div>error...</div>;

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
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={setViewport}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        dragRotate={false}
        ref={(instance) => (mapRef.current = instance)}
        onLoad={() => {
          console.log('load');
          if (mapRef.current) console.log(mapRef.current.getMap().getBounds());
        }}
        onInteractionStateChange={(extra: any) => {
          if (!extra.isDragging && mapRef.current)
            console.log(mapRef.current.getMap().getBounds());
        }}
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
      </ReactMapGL>
    </>
  );
};

export default Map;
