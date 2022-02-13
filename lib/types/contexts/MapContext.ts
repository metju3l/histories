import { QueryResult } from '@apollo/client';
import { PlacesQuery } from '@graphql/queries/place.graphql';
import { PostsQuery } from '@graphql/queries/post.graphql';
import { SidebarPlaceType } from 'pages';
import React from 'react';

import {
  Exact,
  InputMaybe,
  Maybe,
  PlacesInput,
  PostsInput,
} from '../../../.cache/__types__';
import { IBounds, IViewport } from '../map';

interface IMapContext {
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

export default IMapContext;
