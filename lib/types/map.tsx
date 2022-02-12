import { QueryResult } from '@apollo/client';
import { PlacesQuery } from '@graphql/geo.graphql';
import { PostsQuery } from '@graphql/post.graphql';
import { SidebarPlaceType } from 'pages';
import React from 'react';

import {
  Exact,
  InputMaybe,
  Maybe,
  PlacesInput,
  PostsInput,
} from '../../.cache/__types__';

export type MapStyles = 'theme' | 'light' | 'dark' | 'satellite';

export interface IViewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface IBounds {
  maxLatitude: number;
  minLatitude: number;
  maxLongitude: number;
  minLongitude: number;
}

export interface IMapContext {
  bounds: IBounds;
  setBounds: React.Dispatch<React.SetStateAction<IBounds>>;
  whatToShow: 'places' | 'photos';
  setWhatToShow: React.Dispatch<React.SetStateAction<'places' | 'photos'>>;
  viewport: IViewport;
  setViewport: React.Dispatch<React.SetStateAction<IViewport>>;
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
}
