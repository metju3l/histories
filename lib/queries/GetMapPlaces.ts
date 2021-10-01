import DbConnector from '../database/driver';

const GetMapPlaces = async ({
  maxLatitude,
  minLatitude,
  maxLongitude,
  minLongitude,
}: {
  maxLatitude: number;
  minLatitude: number;
  maxLongitude: number;
  minLongitude: number;
}) => {
  const query = `MATCH (place:Place)
WHERE place.latitude >= ${minLatitude} AND place.latitude <= ${maxLatitude}
AND place.longitude >= ${minLongitude} AND place.longitude <= ${maxLongitude}
RETURN COLLECT(place) AS places`;

  const driver = DbConnector();
  const session = driver.session();

  const result = await session.run(query);
  driver.close();

  return result.records[0]
    .get('places')
    .map(
      (place: {
        identity: any;
        properties: { latitude: any; longitude: any };
      }) => {
        return {
          id: Number(place.identity),
          latitude: Number(place.properties.latitude),
          longitude: Number(place.properties.longitude),
        };
      }
    );
};

export default GetMapPlaces;
