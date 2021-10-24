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
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import { useCreateCommentMutation, usePostQuery } from '@graphql/post.graphql';
import TimeAgo from 'react-timeago';
import { Comment } from '@components/Comment';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import {
  HeartIcon,
  ChatIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import { Modal, Menu } from '@components/Modal';
import { toast } from 'react-hot-toast';

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
  const [showModal, setShowModal] = React.useState(false);

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          setDetail(false);
          setIsOpen(false);
        }}
      >
        <section className="absolute justify-between z-50 top-[50%] left-[50%] bg-white max-h-[600px] max-w-[800px] w-full h-full -translate-y-1/2 -translate-x-1/2 rounded-xl">
          <Gallery photos={photos} onClick={openLightbox} />
        </section>
      </Modal>
      <DetailModal
        open={detail}
        onClose={() => {
          setIsOpen(true);
          setDetail(false);
        }}
        place={place}
        currentImage={currentImage}
        setCurrentImage={setCurrentImage}
      />
    </>
  );
};

const DetailModal: React.FC<{
  onClose: () => void;
  place: any;
  open: boolean;
  currentImage: number;
  setCurrentImage: React.Dispatch<React.SetStateAction<number>>;
}> = ({ onClose, place, open, currentImage, setCurrentImage }) => {
  const [imageInSequence, setImageInSequence] = useState(0);
  const { data, loading, error, refetch } = usePostQuery({
    variables: { id: place.posts[currentImage].id },
  });
  const isLogged = useIsLoggedQuery();
  const [commentContent, setCommentContent] = useState('');
  const [createCommentMutation] = useCreateCommentMutation();

  if (loading || isLogged.loading) return <div>loading</div>;
  if (error || isLogged.error) return <div>error</div>;

  return (
    <Modal onClose={onClose} open={open}>
      <section className="absolute justify-between z-50 top-[50%] left-[50%] bg-white max-h-[600px] max-w-[800px] w-full h-full -translate-y-1/2 -translate-x-1/2 rounded-xl flex">
        {/* NAVIGATION IN PLACE PHOTOS */}
        {currentImage > 0 && (
          <button onClick={() => setCurrentImage(currentImage - 1)}>
            <ChevronLeftIcon className="h-10 w-10 absolute z-50 top-[50%] -left-20 -translate-y-1/2 text-white" />
          </button>
        )}
        {currentImage < place.posts.length - 1 && (
          <button onClick={() => setCurrentImage(currentImage + 1)}>
            <ChevronRightIcon className="h-10 w-10 absolute z-50 top-[50%] -right-20 -translate-y-1/2 text-white" />
          </button>
        )}

        {/* PHOTO */}
        <div className="relative max-h-[600px] max-w-[480px] w-full h-full ">
          {/* NAVIGATION IN COLLECTION */}
          {place.posts[currentImage].url.length > 1 && (
            <>
              {imageInSequence > 0 && (
                <button onClick={() => setImageInSequence(imageInSequence - 1)}>
                  <ChevronLeftIcon className="h-8 w-8 absolute z-50 top-[50%] left-0 -translate-y-1/2 text-white" />
                </button>
              )}
              {imageInSequence < place.posts[currentImage].url.length - 1 && (
                <button onClick={() => setImageInSequence(imageInSequence + 1)}>
                  <ChevronRightIcon className="h-8 w-8 absolute z-50 top-[50%] right-0 -translate-y-1/2 text-white" />
                </button>
              )}
            </>
          )}
          <Image
            src={place.posts[currentImage].url[imageInSequence]}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            alt="Post"
            className="rounded-l-xl"
          />
        </div>
        <div className="flex-auto h-full">
          {/* POST DETAILS */}
          <div className="w-full justify-between flex p-3 border-b border-[#EEEFEE]">
            <div className="flex items-center gap-2">
              <div className="relative rounded-full w-8 h-8">
                <Image
                  src={GeneratedProfileUrl(
                    place.posts[currentImage].author.firstName,
                    place.posts[currentImage].author.lastName
                  )}
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
                  className="rounded-full"
                  alt="Profile picture"
                />
              </div>
              {`${place.posts[currentImage].author.firstName} ${place.posts[currentImage].author.lastName}`}
            </div>
            <Menu
              items={[
                { title: 'Report', onClick: () => {} },
                { title: 'Unfollow', onClick: () => {} },
                {
                  title: 'Go to post',
                  href: `/post/${place.posts[currentImage].id}`,
                },
                {
                  title: 'Copy link',
                  onClick: () =>
                    navigator.clipboard.writeText(
                      `https://www.histories.cc/post/${data?.post.id}`
                    ),
                },
              ]}
            >
              <button className="">
                <DotsHorizontalIcon className="h-6 w-6" />
              </button>
            </Menu>
          </div>

          {/* COMMENTS */}
          <div id="comments" className="w-full overflow-y-auto h-[400px] pt-2">
            {data!.post.description ?? ''}
            {data!.post.comments.map((comment: any) => (
              <Comment
                content={comment.content}
                author={comment.author}
                createdAt={comment.createdAt}
                id={comment.id}
                logged={isLogged.data!.isLogged ?? null}
                key={comment.id}
                refetch={refetch}
              />
            ))}
          </div>

          {/* REACTIONS */}
          <div
            id="reactions"
            className="w-full items-center gap-2 p-3 border-t border-[#EEEFEE]"
          >
            <div className="w-full flex gap-2">
              <HeartIcon className="h-8 w-8" />
              <ChatIcon className="h-8 w-8" />
              <PaperAirplaneIcon className="h-8 w-8 rotate-45" />
              <BookmarkIcon className="h-8 w-8 absolute right-4" />
            </div>
            <strong className="font-semibold">
              {data?.post.likes.length} likes
            </strong>
            <br />
            <TimeAgo date={data!.post.createdAt} />
          </div>
          <form
            className="w-full flex items-center gap-2 p-3 border-t border-[#EEEFEE]"
            onSubmit={async (event) => {
              event.preventDefault();

              try {
                await createCommentMutation({
                  variables: {
                    target: place.posts[currentImage].id,
                    content: commentContent,
                  },
                });
                setCommentContent('');
                await refetch();
              } catch (error: any) {
                toast.error(error.message);
              }
            }}
          >
            <textarea
              className="border-2 border-gray-300 rounded-xl bg-gray-100 p-2 resize-none overflow-hidden"
              onChange={(e: any) => setCommentContent(e.target.value)}
              value={commentContent}
              placeholder="Write a comment..."
            />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </section>
    </Modal>
  );
};

export default MapGL;
