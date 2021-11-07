import { NextRouter } from 'next/router';

type UpdateUrlProps = {
  longitude: number;
  latitude: number;
  zoom: number;
  place: number | null;
  router: NextRouter;
};

// save latitude, longitude, zoom in url props
const UpdateUrl = ({
  router,
  longitude,
  latitude,
  zoom,
  place,
}: UpdateUrlProps): void => {
  router.replace({
    pathname: 'map',
    query: {
      lat: latitude.toFixed(6),
      lng: longitude.toFixed(6),
      zoom: zoom.toFixed(2),
      place,
    },
  });
};

export default UpdateUrl;
