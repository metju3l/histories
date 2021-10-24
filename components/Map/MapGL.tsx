import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import ReactMapGL, {
  Marker,
  NavigationControl,
  GeolocateControl,
  Source,
  FlyToInterpolator,
  Layer,
} from 'react-map-gl';
import { usePathsQuery, usePlaceQuery } from '@graphql/geo.graphql';
import Image from 'next/image';
import useSuperCluster from 'use-supercluster';
import Gallery from 'react-photo-gallery';
import { Dialog } from '@headlessui/react';
import { Button } from '@nextui-org/react';

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
  oldPoints: any;
  setBounds: React.Dispatch<
    React.SetStateAction<{
      maxLatitude: number;
      minLatitude: number;
      maxLongitude: number;
      minLongitude: number;
    }>
  >;
}> = ({ searchCoordinates, setBounds, oldPoints }) => {
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

  // convert points to geoJSON format
  const points = oldPoints.map((point: any) => ({
    type: 'Feature',
    properties: {
      cluster: false,
      id: point.id,
      category: 'place',
    },
    geometry: { type: 'Point', coordinates: [point.longitude, point.latitude] },
  }));

  // generate clusters from points
  const { clusters, supercluster } = useSuperCluster({
    points: points,
    zoom: viewport.zoom,
    bounds: mapRef.current
      ? mapRef.current.getMap().getBounds().toArray().flat()
      : null,
    options: { radius: 75, maxZoom: 20 },
  });

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

        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } =
            cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                latitude={latitude}
                longitude={longitude}
              >
                <div
                  className="text-white bg-red-500 h-20 w-20 rounded-full py-[2em] text-center "
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    );

                    setViewport({
                      ...viewport,
                      latitude,
                      longitude,
                      zoom: expansionZoom,
                    });
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }

          return (
            <MapPlace
              key={cluster.id}
              place={oldPoints.find(
                (point: any) =>
                  point.latitude === latitude && point.longitude === longitude
              )}
            />
          );
        })}
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
          <Image
            src={place.posts[0].url[0]}
            width={60}
            height={60}
            className="rounded-full w-12 h-12 object-cover"
            alt="Picture on map"
          />
        </a>
      </Marker>
      <MapModal setIsOpen={setIsOpen} isOpen={isOpen} place={place} />
    </>
  );
};

type MapModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  place: any;
};

const MapModal: React.FC<MapModalProps> = ({ isOpen, setIsOpen, place }) => {
  const photos = place.posts.map((photo: { url: string[] }) => ({
    src: photo.url[0],
    width: 4,
    height: 3,
  }));
  const [detail, setDetail] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setDetail(true);
    setIsOpen(false);
  }, []);

  console.log(place);

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => {
          setDetail(false);
          setIsOpen(false);
        }}
      >
        <Dialog.Overlay />
        <div className="absolute top-0 left-0 z-50 w-full h-full pb-32 px-12">
          <div className="max-w-6xl w-full mt-24 h-full m-auto pt-18 p-4 bg-white rounded-2xl">
            <Button
              onClick={() => {
                setDetail(false);
                setIsOpen(false);
              }}
            >
              close
            </Button>
            <Gallery photos={photos} onClick={openLightbox} />
          </div>
        </div>
      </Dialog>
      <Dialog
        open={detail}
        onClose={() => {
          setIsOpen(true);
          setDetail(false);
        }}
      >
        <Dialog.Overlay />{' '}
        <div className="absolute top-0 left-0 z-50 w-full h-full pb-32 px-12">
          <div className="mt-24 h-full m-auto pt-18 p-4 bg-black rounded-2xl">
            <Button
              onClick={() => {
                setDetail(false);
                setIsOpen(true);
              }}
            >
              close
            </Button>
            <div className="flex gap-4">
              <div>
                <img
                  src={place.posts[currentImage].url[0]}
                  alt="Post"
                  width="100%"
                />
              </div>
              <div className="w-64 h-auto text-white">comments</div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default MapGL;
