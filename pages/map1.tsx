import { ApolloQueryResult } from '@apollo/client';
import { Layout } from '@components/Layout';
import { MapPostsQuery, useMapPostsQuery } from '@graphql/geo.graphql';
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

  const { data, loading, error, refetch } = useMapPostsQuery({
    variables: {
      maxLatitude: 0,
      maxLongitude: 0,
      minLatitude: 0,
      minLongitude: 0,
    },
  });

  const [timeLimitation, setTimeLimitation] = useState<[number, number]>([
    1000,
    new Date().getTime(),
  ]);

  const [sidebarPlace, setSidebarPlace] = useState<number | null>(null);

  // map viewport
  const [mapViewport, setMapViewport] = useState<Viewport>({
    latitude: 37.7577,
    longitude: -122.4376,
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
      <section className="flex w-full h-screen">
        <div id="map" className="w-full h-full">
          <MapGL
            viewport={mapViewport}
            setViewport={setMapViewport}
            data={data}
            refetch={refetch}
            setSidebar={setSidebarPlace}
            sidebar={sidebarPlace}
          />
        </div>
        <div id="sidebar" className="w-full h-full">
          {JSON.stringify(data?.mapPosts.length)}
        </div>
      </section>
    </Layout>
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
  data: MapPostsQuery | undefined;
  refetch: (args: Bounds) => Promise<ApolloQueryResult<MapPostsQuery>>;
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
        if (!state.isDragging && mapRef.current)
          // refetch data
          await refetch(
            // get bounds of map
            ConvertBounds(mapRef.current.getMap().getBounds())
          );
      }}
    >
      {data?.mapPosts
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
