import { ApolloQueryResult } from '@apollo/client';
import { Layout } from '@components/Layout';
import { TimeLine } from '@components/TimeLine';
import { PlacesQuery, usePlacesQuery } from '@graphql/geo.graphql';
import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import ReactMapGL, { ExtraState, MapRef, Marker } from 'react-map-gl';

type Viewport = {
  latitude: number;
  longitude: number;
  zoom: number;
};

type Bounds = {
  maxLatitude: number;
  minLatitude: number;
  maxLongitude: number;
  minLongitude: number;
};

function PropsToUrl({
  pathname,
  router,
  query,
}: {
  pathname: string;
  router: NextRouter;
  query: any;
}): void {
  router.replace({
    pathname,
    query,
  });
}

const Map: React.FC = () => {
  const router = useRouter();

  const { data, loading, error, refetch } = usePlacesQuery({
    variables: {
      input: {
        filter: { take: 1 },
      },
    },
  });

  const [whatToShow, setWhatToShow] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const [timeLimitation, setTimeLimitation] = useState<[number, number]>([
    1000,
    new Date().getTime(),
  ]);

  const [sidebarPlace, setSidebarPlace] = useState<number | null>(null);

  // map viewport
  const [mapViewport, setMapViewport] = useState<Viewport>({
    latitude: 50,
    longitude: 15.1,
    zoom: 3.5,
  });

  return (
    <Layout title="map | hiStories">
      {showSidebar ? (
        <>
          <div
            className="flex justify-between items-center w-full fixed top-14 z-20 left-0 h-12 py-4 px-4 bg-white shadow-sm border-gray-200 border-b"
            style={{ width: 'calc(70vw - 8px)' }}
          >
            <span className="w-8" />
            <div className="flex gap-2">
              <button
                className={`py-1 w-24 border border-gray-200 hover:text-black hover:border-gray-400 ${
                  whatToShow !== 'photos'
                    ? 'text-black border-gray-400'
                    : 'text-gray-500'
                } rounded-xl`}
                onClick={() => setWhatToShow('places')}
              >
                Places
              </button>
              <button
                className={`py-1 w-24 border border-gray-200 hover:text-black hover:border-gray-400 ${
                  whatToShow === 'photos'
                    ? 'text-black border-gray-400'
                    : 'text-gray-500'
                } rounded-xl`}
                onClick={() => setWhatToShow('photos')}
              >
                Photos
              </button>
            </div>
            <button onClick={() => setShowSidebar(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 py-1 border border-gray-200 hover:text-black text-gray-500 hover:border-gray-400 rounded-xl"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          <section style={{ width: '70vw', paddingTop: '3rem' }}>
            <div className="w-full h-full p-4 text-black bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.places.map(
                (place) => place.preview && <MapPostCard {...place} />
              )}
            </div>
          </section>
        </>
      ) : (
        <button onClick={() => setShowSidebar(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 py-1 border border-gray-200 hover:text-black text-gray-500 hover:border-gray-400 rounded-xl transform -rotate-180 bg-white absolute top-18 left-4 z-20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
      <div
        className="p-2 fixed top-14 right-0 bg-white"
        style={{
          width: showSidebar ? '30vw' : '100vw',
          height: 'calc(100% - 56px)',
        }}
      >
        {' '}
        <div
          className="absolute top-2 left-0 z-20 px-8 pt-2"
          style={{ width: '30vw', height: '8vh' }}
        >
          <TimeLine
            domain={[1000, new Date().getFullYear()]}
            setTimeLimitation={setTimeLimitation}
          />
        </div>
        <MapGL
          viewport={mapViewport}
          setViewport={setMapViewport}
          data={data}
          refetch={refetch}
          setSidebar={setSidebarPlace}
          sidebar={sidebarPlace}
        />
      </div>
    </Layout>
  );
};

const MapPostCard: React.FC<{
  id: number;
  name?: string | null;
  longitude: number;
  latitude: number;
  icon?: string | null;
  preview?: string[] | null;
}> = ({ id, preview, name }) => {
  return (
    <div className="flex flex-col w-full h-64 bg-white border border-gray-200 rounded-lg hover:shadow-sm">
      {preview && (
        <div className="relative w-full h-full rounded-t-lg cursor-pointer bg-secondary">
          <Image
            src={preview[0]}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="rounded-t-lg"
            alt="Profile picture"
          />
        </div>
      )}
      <div className="px-4 py-2">
        <h2 className="font-medium text-lg">{name}</h2>
        <h3 className="text-gray-600" style={{ fontSize: '12px' }}>
          {id} Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
          unde
        </h3>
      </div>
    </div>
  );
};

function ConvertBounds(bounds: {
  _ne: { lat: number; lng: number };
  _sw: { lat: number; lng: number };
}): Bounds {
  return {
    maxLatitude: bounds._ne.lat,
    minLatitude: bounds._sw.lat,
    maxLongitude: bounds._ne.lng,
    minLongitude: bounds._sw.lng,
  };
}

type MapGLProps = {
  viewport: Viewport;
  setViewport: React.Dispatch<React.SetStateAction<Viewport>>;
  setSidebar: React.Dispatch<React.SetStateAction<number | null>>;
  data: PlacesQuery | undefined;
  refetch: (args: any) => Promise<ApolloQueryResult<PlacesQuery>>;
  sidebar: number | null;
};

const MapGL: React.FC<MapGLProps> = ({
  viewport,
  setViewport,
  data,
  refetch,
  setSidebar,
  sidebar,
}) => {
  const mapRef = useRef<MapRef | null>(null);

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      onViewportChange={(viewport: any) => setViewport(viewport)}
      className="rounded-lg"
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} // MAPBOX API ACCESS TOKEN
      mapStyle="mapbox://styles/mapbox/streets-v11" // MAPBOX STYLE
      ref={(instance) => (mapRef.current = instance)}
      onLoad={async () => {
        // if map is rendered get bounds and refetch
        if (mapRef.current)
          await refetch(
            // get bounds of map
            ConvertBounds(mapRef.current.getMap().getBounds())
          );
      }}
      onInteractionStateChange={async (state: ExtraState) => {
        // when map state changes (dragging, zooming, rotating, etc.)
        if (!state.isDragging && mapRef.current) {
          // refetch data
          await refetch({
            input: {
              filter:
                // get bounds of map
                ConvertBounds(mapRef.current.getMap().getBounds()),
            },
          });

          console.log(data);
        }
      }}
    >
      {data?.places
        .filter((place) => place.preview || place.icon)
        .map((place) => {
          return (
            <Marker
              key={place.id}
              latitude={place.latitude}
              longitude={place.longitude}
            >
              <div
                onClick={() => setSidebar(place.id)}
                className="cursor-pointer -translate-y-1/2 -translate-x-1/2"
              >
                {place.icon ? (
                  <Image
                    src={place.icon}
                    width={90}
                    height={90}
                    objectFit="contain"
                    alt="Picture on map"
                  />
                ) : (
                  <Image
                    // @ts-ignore
                    src={place.preview[0]}
                    width={60}
                    height={60}
                    className="object-cover rounded-full"
                    alt="Picture on map"
                  />
                )}
              </div>
            </Marker>
          );
        })}
    </ReactMapGL>
  );
};

export default Map;
