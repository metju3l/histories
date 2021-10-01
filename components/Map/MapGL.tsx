import React, { FC, useEffect, useRef, useState } from 'react';
import ReactMapGL, {
  Marker,
  NavigationControl,
  GeolocateControl,
  Source,
  FlyToInterpolator,
  Layer,
} from 'react-map-gl';
import {
  MapPostsQuery,
  useMapPostsQuery,
  usePathsQuery,
} from '@graphql/geo.graphql';
import MapLoading from './MapLoading';
import LayerIcon from '@public/mapLayerIcon.png';
import Image from 'next/image';
import { TimeLine } from 'components/TimeLine/index';

const GetBounds = (bounds: {
  _ne: { lat: number; lng: number };
  _sw: { lat: number; lng: number };
}) => {
  return {
    maxLatitude: bounds._ne.lat,
    minLatitude: bounds._sw.lat,
    maxLongitude: bounds._ne.lng,
    minLongitude: bounds._sw.lng,
  };
};

const MapGL: FC<{
  searchCoordinates: { lat: number; lng: number };
  images: any;
  setBounds: React.Dispatch<
    React.SetStateAction<{
      maxLatitude: number;
      minLatitude: number;
      maxLongitude: number;
      minLongitude: number;
    }>
  >;
}> = ({ searchCoordinates, setBounds, images }) => {
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
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
        dragRotate={false}
        ref={(instance) => (mapRef.current = instance)}
        onLoad={() => {
          if (mapRef.current) setBounds(mapRef.current.getMap().getBounds());
        }}
        onInteractionStateChange={async (extra: any) => {
          if (!extra.isDragging && mapRef.current)
            setBounds(GetBounds(mapRef.current.getMap().getBounds()));
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
        {viewport.zoom > 12 && Paths}
        {images.data?.mapPosts &&
          // @ts-ignore
          images.data.mapPosts.map((image) => (
            <Marker
              key={image.id}
              latitude={image.latitude}
              longitude={image.longitude}
            >
              <a className="">
                <img
                  src={
                    'https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80'
                  }
                  className="rounded-full w-8 h-8 object-cover"
                  alt="Picture on map"
                />
              </a>
            </Marker>
          ))}

        <div className="absolute bottom-28 right-2 bg-white rounded-md">
          <Image src={LayerIcon} width={32} height={32} alt="alt" />
        </div>
      </ReactMapGL>
    </>
  );
};

export default MapGL;
