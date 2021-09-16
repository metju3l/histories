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
        latitude: any;
        longitude: any;
        url: string;
      };
    }) => ({
      ...node.properties,
      latitude: parseFloat(node.properties.latitude),
      longitude: parseFloat(node.properties.longitude),
      id: node.identity.toNumber(),
    })
  );
};

export default MapPosts;
