import { IMapContext } from '@lib/types/map';
import React from 'react';

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

export const MapContext = React.createContext<IMapContext>({
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
});
