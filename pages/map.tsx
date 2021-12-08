import { ApolloQueryResult } from '@apollo/client';
import { Layout } from '@components/Layout';
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

  // on load change map viewport coordinates according to url parameter
  useEffect(() => {
    /*
    function paramToNum(parameter: any, defaultValue: any) {
      return typeof parameter == 'string'
        ? parseFloat(parameter.substring(0, 9))
        : defaultValue;
    }
    
    setMapViewport({
      ...mapViewport,
      longitude: paramToNum(router.query?.lng, 15),
      latitude: paramToNum(router.query?.lat, 50),
      zoom: paramToNum(router.query?.zoom, 14),
      // @ts-ignore
      transitionDuration: 500,
      transitionInterpolator: new FlyToInterpolator(),
    })
    */
    // @ts-ignore
    // setSidebarPlace(paramToNum(router.query?.place, null));
  }, []);

  return (
    <Layout title="map | hiStories">
      <div
        className="flex justify-center w-full fixed top-14 z-20 left-0 h-12 p-2 bg-white gap-2 shadow-sm border-gray-200 border-b"
        style={{ width: 'calc(70vw - 8px)' }}
      >
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
      <section style={{ width: '70vw', paddingTop: '3rem' }}>
        <div className="w-full h-full p-4 text-black bg-white grid grid-cols-3 gap-4">
          {data?.places.map(
            (place) => place.preview && <MapPostCard {...place} />
          )}
        </div>
      </section>
      <div
        className="p-2 fixed top-14 right-0"
        style={{ width: '30vw', height: 'calc(100% - 56px)' }}
      >
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
