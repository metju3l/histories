import { QueryResult } from '@apollo/client';
import { PlacesQuery } from '@graphql/geo.graphql';
import { PostsQuery } from '@graphql/post.graphql';
import Viewport from '@lib/types/viewport';
import { SidebarPlaceType } from 'pages';
import React from 'react';
import Bounds from 'types/Bounds';

import {
  Exact,
  InputMaybe,
  Maybe,
  PlacesInput,
  PostsInput,
} from '../../../.cache/__types__';

export const defaultValues = {
  bounds: {
    minLatitude: 0,
    maxLatitude: 0,
    minLongitude: 0,
    maxLongitude: 0,
  },
  viewport: {
    latitude: 50,
    longitude: 15.1,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  },
};

type Place = {
  id: number;
  latitude: number;
  longitude: number;
  name?: string;
  description?: string;
  icon?: string | null;
  preview?: Maybe<{
    hash: string;
    blurhash: string;
    width: number;
    height: number;
  }>;
};

export type MapContextType = {
  bounds: Bounds;
  setBounds: React.Dispatch<React.SetStateAction<Bounds>>;
  whatToShow: Maybe<string>;
  setWhatToShow: React.Dispatch<React.SetStateAction<Maybe<string>>>;
  viewport: Viewport;
  setViewport: React.Dispatch<React.SetStateAction<Viewport>>;
  sidebarPlace: Maybe<SidebarPlaceType>;
  setSidebarPlace: React.Dispatch<
    React.SetStateAction<Maybe<SidebarPlaceType>>
  >;
  timeLimitation: [number, number];
  setTimeLimitation: React.Dispatch<React.SetStateAction<[number, number]>>;
  placesQuery:
    | QueryResult<
        PlacesQuery,
        Exact<{
          input?: InputMaybe<PlacesInput> | undefined;
        }>
      >
    | undefined;
  postsQuery:
    | QueryResult<
        PostsQuery,
        Exact<{
          input?: InputMaybe<PostsInput> | undefined;
        }>
      >
    | undefined;
  hoverPlaceId: number | null;
  setHoverPlaceId: React.Dispatch<React.SetStateAction<number | null>>;
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  filteredPlaces: Array<Place>;
  setFilteredPlaces: React.Dispatch<React.SetStateAction<Array<Place>>>;
};

export const MapContext = React.createContext<MapContextType>({
  bounds: defaultValues.bounds,
  setBounds: () => {},
  whatToShow: 'places',
  setWhatToShow: () => {},
  viewport: defaultValues.viewport,
  setViewport: () => {},
  sidebarPlace: null,
  setSidebarPlace: () => {},
  timeLimitation: [0, 2020],
  setTimeLimitation: () => {},
  placesQuery: undefined,
  postsQuery: undefined,
  hoverPlaceId: null,
  setHoverPlaceId: () => {},
  showSidebar: true,
  setShowSidebar: () => {},
  filteredPlaces: [],
  setFilteredPlaces: () => {},
});
