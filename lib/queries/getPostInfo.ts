import DbConnector from '../database/driver';

const GetPostInfo = async ({
  id,
  logged,
}: {
  id: number;
  logged: string | null;
}) => {
  const query = `MATCH (author:User)-[:CREATED]->(post:Post), (post:Post)<-[:LIKE]-(like:User)
  WHERE ID(post) = 17
  RETURN post, author, COLLECT(like) AS likes`;

  const driver = DbConnector();
  const session = driver.session();

  const result = await session.run(query);
  driver.close();

  return {
    ...result.records[0].get('post').properties,
    latitude: parseFloat(result.records[0].get('post').properties.latitude),
    longitude: parseFloat(result.records[0].get('post').properties.longitude),
    id: result.records[0].get('post').identity.toNumber(),
  };
};

export default GetPostInfo;
