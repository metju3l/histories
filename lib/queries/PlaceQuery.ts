import DbConnector from '../database/driver';

const PlaceQuery = async ({ id }: { id: number }) => {
  const query = `
MATCH (post:Post)-[:IS_LOCATED]->(place:Place)
WHERE ID(place) = ${id}
RETURN COLLECT(post) AS posts, place`;

  const driver = DbConnector();
  const session = driver.session();

  const result = await session.run(query);
  driver.close();

  return {
    id: Number(result.records[0].get('place').identity),
    latitude: Number(result.records[0].get('place').properties.latitude),
    longitude: Number(result.records[0].get('place').properties.longitude),
    posts: result.records[0].get('posts').map((post: { identity: any }) => {
      return { id: Number(post.identity) };
    }),
  };
};

export default PlaceQuery;
