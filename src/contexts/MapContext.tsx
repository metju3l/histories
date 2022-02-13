import {
  boundsPlaceholder,
  viewportPlaceholder,
} from '@src/constants/MapPlaceholderValues';
import IMapContext from '@src/types/contexts/MapContext';
import React from 'react';

export const MapContext = React.createContext<IMapContext>({
  bounds: boundsPlaceholder,
  setBounds: () => {},
  whatToShow: 'places',
  setWhatToShow: () => {},
  viewport: viewportPlaceholder,
  setViewport: () => {},
  sidebarPlace: null,
  setSidebarPlace: () => {},
  timeLimitation: [1000, new Date().getFullYear()],
  setTimeLimitation: () => {},
  placesQuery: undefined,
  postsQuery: undefined,
  hoverPlaceId: null,
  setHoverPlaceId: () => {},
  showSidebar: true,
  setShowSidebar: () => {},
});
