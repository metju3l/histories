import Head from 'next/head';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { MdAddBox, MdMap } from 'react-icons/md';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import Link from 'next/link';
import { Navbar } from '@components/Navbar';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import { useCreatePostMutation } from '@graphql/post.graphql';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import MapGL, {
  Marker,
  NavigationControl,
  GeolocateControl,
  FlyToInterpolator,
} from 'react-map-gl';
import router from 'next/router';
import _toast, { toast, Toaster } from 'react-hot-toast';
import { Search } from '@components/MainPage';

const Login: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useIsLoggedQuery();
  const [createPostMutation] = useCreatePostMutation();
  const [coordinates, setCoordinates] = useState([21, 20]);
  const [marker, setMarker] = useState({
    latitude: 40,
    longitude: -100,
  });
  const [events, logEvents] = useState({});
  const [tags, setTags] = useState<Array<string>>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [searchCoordinates, setSearchCoordinates] = useState({
    lat: 50,
    lng: 15,
  });

  const onMarkerDragStart = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }));
  }, []);

  const onMarkerDrag = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }));
  }, []);

  const onMarkerDragEnd = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    });
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCoordinates([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const [viewport, setViewport] = useState({
    latitude: searchCoordinates.lat,
    longitude: searchCoordinates.lng,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  });

  useEffect(() => {
    setViewport({
      ...viewport,
      longitude: searchCoordinates.lng,
      latitude: searchCoordinates.lat,
      zoom: 14,
      // @ts-ignore
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    });
    setMarker({
      longitude: searchCoordinates.lng,
      latitude: searchCoordinates.lat,
    });
  }, [searchCoordinates]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (newTag.slice(-1) === ' ') {
      if (newTag !== '') {
        const newTags = tags;
        if (!tags.includes(newTag.substring(0, newTag.length - 1))) {
          newTags.push(newTag.substring(0, newTag.length - 1));
          setTags(newTags);
        }
      }
      setNewTag('');
    }
  }, [newTag]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div>loading</div>;
  if (isLoading) return <div>loading</div>;
  if (error) return <div>error</div>;

  //  if (data.isLogged) router.replace('/');
  return (
    <body>
      <Navbar data={data} />

      <div className="h-screen text-black bg-[#F6F8FA]">
        <div className="h-[30vh] flex">
          <div className=" p-[10px]">
            <Search setSearchCoordinates={setSearchCoordinates} />
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
            <Marker
              longitude={marker.longitude}
              latitude={marker.latitude}
              offsetTop={-20}
              offsetLeft={-10}
              draggable
              onDragStart={onMarkerDragStart}
              onDrag={onMarkerDrag}
              onDragEnd={onMarkerDragEnd}
            >
              <svg
                height={20}
                viewBox="0 0 24 24"
                style={{
                  fill: '#d00',
                  stroke: 'none',
                }}
              >
                <path
                  d="M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
C20.1,15.8,20.2,15.8,20.2,15.7z"
                />
              </svg>
            </Marker>
            <NavigationControl
              style={{
                bottom: 240,
                right: 0,
                padding: '10px',
              }}
              showCompass={false}
            />
          </MapGL>
        </div>
        <div className="flex w-full gap-2">
          {tags.map((tag, index) => {
            return (
              <div
                className="bg-indigo-500 text-white p-2 rounded-xl"
                key={index}
              >
                #{tag}
                <button
                  className="text-red-300 ml-4"
                  onClick={() => {
                    const newTags = tags.filter((x) => x !== tag);
                    setTags(newTags);
                  }}
                >
                  x
                </button>
              </div>
            );
          })}
        </div>
        <Formik
          initialValues={{
            photoDate: '',
            description: '',
          }}
          onSubmit={async (values) => {
            try {
              setIsLoading(true);
              await createPostMutation({
                variables: {
                  ...values,
                  photoDate: Date.parse(values.photoDate).toString(),
                  hashtags: JSON.stringify(tags),
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                },
              });
              router.push('/');
            } catch (error) {
              toast.error(error.message);
            }
            setIsLoading(false);
          }}
        >
          {() => (
            <Form>
              <Input label="photoDate" type="date" name="photoDate" />
              <Input label="Description" name="description" type="text" />
              <label>hashtags</label>
              <input
                className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                name="hashtags"
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </body>
  );
};

const Input: FC<{
  type: string;
  name: string;
  label: string;
}> = ({ type, name, label }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Field
        type={type}
        className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        name={name}
      />
      <ErrorMessage name={name} />
      <br />
    </div>
  );
};

export default Login;
