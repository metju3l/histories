import { MapContext } from '@src/contexts/MapContext';
import React from 'react';

type GetPointsType = Array<{
  type: string;
  properties: {
    cluster: boolean;
    id: number;
    icon: string | null | undefined;
    preview: string | undefined;
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
}>;

function GetPoints(): GetPointsType {
  const mapContext = React.useContext(MapContext);

  return (
    mapContext.placesQuery?.data?.places
      ?.filter(
        (place) =>
          place.posts.filter((post) => {
            const postDate = new Date(post.postDate).getFullYear(); // get post year
            return (
              postDate > mapContext.timeLimitation[0] &&
              postDate < mapContext.timeLimitation[1]
            ); // compare year with timeline limitations
          }).length > 0
      )
      .map((place) => ({
        type: 'Feature',
        properties: {
          cluster: false,
          id: place.id,
          icon: place.icon,
          preview: place?.preview?.hash,
        },
        geometry: {
          type: 'Point',
          coordinates: [place.longitude, place.latitude],
        },
      })) ?? []
  );
}

export default GetPoints;
