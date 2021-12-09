import { ApolloQueryResult } from '@apollo/client';
import { Layout } from '@components/Layout';
import { TimeLine } from '@components/TimeLine';
import { PlacesQuery, usePlacesQuery } from '@graphql/geo.graphql';
import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
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


  const [sidebarPlace, setSidebarPlace] = useState<{
    id: number;
    name?: string | null;
    longitude: number;
    latitude: number;
    icon?: string | null;
    preview?: string[] | null;
  } | null>(null);

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
          <div className="fixed top-0 left-0 z-20 h-12 md:top-14 md:w-[70vw] w-[60vw] px-[8px]">
            <div className="flex items-center justify-between w-full px-4 py-4 bg-white border-b border-gray-200 shadow-sm">
              <span className="w-8" />

              <div className="flex gap-2">
                {sidebarPlace ? (
                  <>
                    <button onClick={() => setSidebarPlace(null)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 py-1 text-gray-500 border border-gray-200 hover:text-black hover:border-gray-400 rounded-xl"
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
                    <div
                      className={`py-1 min-w-24 border border-gray-200 text-gray-600 px-4 rounded-xl`}
                    >
                      Place detail
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
              <button onClick={() => setShowSidebar(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 py-1 text-gray-500 border border-gray-200 hover:text-black hover:border-gray-400 rounded-xl"
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
          </div>

          <section className="md:pt-[3rem]">
            {sidebarPlace ? (
              <div className="w-full h-full p-4 pt-8 text-black bg-white md:w-[70vw] w-[60vw]">
                <h1 className="flex justify-center w-full text-lg font-medium">
                  {sidebarPlace.name}
                </h1>
              </div>
            ) : (
              <div className="w-full h-full p-4 pt-8 text-black bg-white md:w-[70vw] w-[60vw] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.places.map(
                  (place) =>
                    place.preview && (
                      <MapPostCard
                        place={place}
                        setSidebarPlace={setSidebarPlace}
                      />
                    )
                )}
              </div>
            )}
          </section>
        </>
      ) : (
        <button onClick={() => setShowSidebar(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute z-20 w-8 h-8 py-1 text-gray-500 bg-white border border-gray-200 hover:text-black hover:border-gray-400 rounded-xl transform -rotate-180 top-18 left-4"
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
        className={`p-2 fixed md:top-14 top-0 right-0 bg-white ${
          showSidebar ? 'md:w-[30vw] w-[40vw]' : 'w-[100vw]'
        }`}
        style={{
          height: 'calc(100% - 56px)',
        }}
      >
        <div
          className={`absolute top-2 w-[30vw] ${
            showSidebar ? 'left-0' : 'right-0'
          } z-20 px-8 pt-2`}
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
  place: {
    id: number;
    name?: string | null;
    longitude: number;
    latitude: number;
    icon?: string | null;
    preview?: string[] | null;
  };
  setSidebarPlace: React.Dispatch<
    React.SetStateAction<{
      id: number;
      name?: string | null | undefined;
      longitude: number;
      latitude: number;
      icon?: string | null | undefined;
      preview?: string[] | null | undefined;
    } | null>
  >;
}> = ({ place, setSidebarPlace }) => {
  return (
    <div
      className="flex flex-col w-full h-64 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm"
      onClick={() => setSidebarPlace(place)}
    >
      {place.preview && (
        <div className="relative w-full h-full rounded-t-lg cursor-pointer bg-secondary">
          <Image
            src={place.preview[0]}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="rounded-t-lg"
            alt="Profile picture"
          />
        </div>
      )}
      <div className="px-4 py-2">
        <h2 className="text-lg font-medium">{place.name}</h2>
        <h3 className="text-gray-600" style={{ fontSize: '12px' }}>
          {place.id} Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Odio unde
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
  setSidebar: React.Dispatch<
    React.SetStateAction<{
      id: number;
      name?: string | null | undefined;
      longitude: number;
      latitude: number;
      icon?: string | null | undefined;
      preview?: string[] | null | undefined;
    } | null>
  >;
  data: PlacesQuery | undefined;
  refetch: (args: any) => Promise<ApolloQueryResult<PlacesQuery>>;
  sidebar: {
    id: number;
    name?: string | null | undefined;
    longitude: number;
    latitude: number;
    icon?: string | null | undefined;
    preview?: string[] | null | undefined;
  } | null;
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
                onClick={() => setSidebar(place)}
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
