import React from 'react';

import { MapContext } from '../MapContext';
import MapPostCard from '../MapPostCard';

const Places: React.FC = () => {
  const mapContext = React.useContext(MapContext);

  return (
    <>
      {mapContext.placesQuery?.data?.places
        .filter(
          (place) =>
            place.latitude > mapContext.bounds.minLatitude &&
            place.latitude < mapContext.bounds.maxLatitude &&
            place.longitude > mapContext.bounds.minLongitude &&
            place.longitude < mapContext.bounds.maxLongitude &&
            mapContext.placesQuery?.data?.places.filter(
              (x) => x.id === place.id
            )
        )
        .map(
          (place) =>
            place.preview && (
              <MapPostCard
                // @ts-ignore
                place={place}
                setSidebarPlace={mapContext.setSidebarPlace}
              />
            )
        ) ?? <></>}
    </>
  );
};

export default Places;
