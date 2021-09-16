import DbConnector from '../database/driver';

const MapPosts = async ({
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
  console.log({
    maxLatitude,
    minLatitude,
    maxLongitude,
    minLongitude,
  });

  const query = `MATCH (post:Post)
  WHERE post.latitude > ${minLatitude} AND post.latitude < ${maxLatitude}
  AND post.longitude > ${minLongitude} AND post.longitude < ${maxLongitude}
  RETURN collect(post) as posts LIMIT 100`;

  const driver = DbConnector();
  const session = driver.session();

  const result = await session.run(query);
  driver.close();

  return result.records[0].get('posts').map(
    (node: {
      identity: any;
      properties: {
        latitude: number;
        longitude: number;
        url: string;
      };
    }) => ({
      ...node.properties,
      id: node.identity.toNumber(),
    })
  );
};

export default MapPosts;
