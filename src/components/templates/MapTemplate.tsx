import MapPageGrid from '@components/modules/mapPage/Grid';
import { useMapPlacesQuery } from '@graphql/queries/place.graphql';
import { usePostsQuery } from '@graphql/queries/post.graphql';
import {
  boundsPlaceholder,
  viewportPlaceholder,
} from '@src/constants/MapPlaceholderValues';
import { MapContext } from '@src/contexts/MapContext';
import { IViewport } from '@src/types/map';
import React, { useState } from 'react';

import { Maybe } from '.cache/__types__';

interface MapTemplateProps {
  lat: Maybe<number>;
  lng: Maybe<number>;
  zoom: Maybe<number>;
  minDate: Maybe<number>;
  maxDate: Maybe<number>;
  place: Maybe<number>;
}

const MapTemplate: React.FC<MapTemplateProps> = ({
  lat,
  lng,
  zoom,
  minDate,
  maxDate,
  place,
}) => {
  const [bounds, setBounds] = useState(boundsPlaceholder); // viewport bounds

  const placesQuery = useMapPlacesQuery({
    variables: {
      input: {
        filter: { take: 25 },
      },
    },
  }); // places query

  const postsQuery = usePostsQuery({
    variables: {
      input: {
        filter: { take: 1 },
      },
    },
  }); // posts query

  const [hoverPlaceId, setHoverPlaceId] = useState<number | null>(null); // place id on hover
  const [whatToShow, setWhatToShow] = useState<'places' | 'photos'>('places'); // what to show on the right panel
  const [showSidebar, setShowSidebar] = useState<boolean>(true); // is sidebar visible
  const [timeLimitation, setTimeLimitation] = useState<[number, number]>([
    1000,
    new Date().getFullYear(),
  ]);

  const [sidebarPlace, setSidebarPlace] = useState<Maybe<number>>(place);

  // map viewport
  const [viewport, setViewport] = useState<IViewport>({
    ...viewportPlaceholder,
    latitude: lat || viewportPlaceholder.latitude,
    longitude: lng || viewportPlaceholder.longitude,
    zoom: zoom || viewportPlaceholder.zoom,
  });

  return (
    <MapContext.Provider
      value={{
        bounds,
        setBounds,
        whatToShow,
        setWhatToShow,
        viewport,
        setViewport,
        sidebarPlace,
        setSidebarPlace,
        timeLimitation,
        setTimeLimitation,
        placesQuery,
        postsQuery,
        hoverPlaceId,
        setHoverPlaceId,
        showSidebar,
        setShowSidebar,
      }}
    >
      <MapPageGrid />
    </MapContext.Provider>
  );
};

export default MapTemplate;
