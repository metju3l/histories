import { Layout } from '@components/Layout';
import { MapPostsQuery, useMapPostsQuery } from '@graphql/geo.graphql';
import React, { useRef, useState } from 'react';
import ReactMapGL from 'react-map-gl';

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

const Map: React.FC = () => {
  const { data, loading, error, fetchMore } = useMapPostsQuery({
    variables: {
      maxLatitude: 0,
      maxLongitude: 0,
      minLatitude: 0,
      minLongitude: 0,
    },
  });

  const [viewport, setViewport] = useState<Viewport>({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  const [bounds, setBounds] = useState<Bounds>({
    maxLatitude: 0,
    minLatitude: 0,
    maxLongitude: 0,
    minLongitude: 0,
  });

  return (
    <Layout title="map | hiStories">
      <section className="flex w-full h-screen">
        <div id="map" className="w-full h-full">
          <MapGL
            viewport={viewport}
            setViewport={setViewport}
            data={data}
            fetchMore={fetchMore}
            setBounds={setBounds}
          />
        </div>
        <div id="sidebar" className="w-full h-full">
          sidebar
        </div>
      </section>
    </Layout>
  );
};

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

const MapGL: React.FC<{
  viewport: Viewport;
  setViewport: React.Dispatch<React.SetStateAction<Viewport>>;
  data: MapPostsQuery | undefined;
  fetchMore: any;
  setBounds: React.Dispatch<React.SetStateAction<Bounds>>;
}> = ({ viewport, setViewport, data, fetchMore, setBounds }) => {
  const mapRef = useRef<any>(null);

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      onViewportChange={(viewport: any) => setViewport(viewport)}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onLoad={(event) => {
        if (mapRef.current) setBounds(mapRef.current.getMap().getBounds());
      }}
      onInteractionStateChange={async (s: any) => {
        // when map state changes (dragging, zooming, rotating, etc.)
        if (!s.isDragging && mapRef.current)
          setBounds(GetBounds(mapRef.current.getMap().getBounds()));
      }}
    />
  );
};

export default Map;
