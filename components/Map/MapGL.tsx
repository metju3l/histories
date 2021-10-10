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
  usePlaceQuery,
} from '@graphql/geo.graphql';
import MapLoading from './MapLoading';
import LayerIcon from '@public/mapLayerIcon.png';
import Image from 'next/image';
import { TimeLine } from 'components/TimeLine/index';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { EnumBooleanMember } from '@babel/types';

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
  points: any;
  setBounds: React.Dispatch<
    React.SetStateAction<{
      maxLatitude: number;
      minLatitude: number;
      maxLongitude: number;
      minLongitude: number;
    }>
  >;
}> = ({ searchCoordinates, setBounds, points }) => {
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
        {points &&
          // @ts-ignore
          points.map((post) => <MapPlace place={post} key={post.id} />)}

        <div className="absolute bottom-28 right-2 bg-white rounded-md">
          <Image src={LayerIcon} width={32} height={32} alt="alt" />
        </div>
      </ReactMapGL>
    </>
  );
};

const MapPlace = ({ place }: { place: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Marker latitude={place.latitude} longitude={place.longitude}>
        <a
          className=""
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <img
            src={
              'https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80'
            }
            className="rounded-full w-12 h-12 object-cover"
            alt="Picture on map"
          />
        </a>
      </Marker>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => {
            setIsOpen(false);
          }}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {`Found ${place.posts.length} posts`}
                </Dialog.Title>
                <div className="mt-2">
                  {place.posts.map((post: any) => (
                    <div key={post.id}>
                      <img
                        src={post.url}
                        className="w-12 h-12 object-cover"
                        alt="Picture on map"
                      />
                      author:{' '}
                      {`${post.author.firstName} ${post.author.lastName}`}
                      <br />
                      {post.description}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MapGL;
