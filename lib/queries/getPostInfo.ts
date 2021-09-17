import DbConnector from '../database/driver';

const GetPostInfo = async ({
  id,
  logged,
}: {
  id: number;
  logged: string | null;
}) => {
  const query = `
WITH ${logged} AS loggedID  
MATCH (author:User)-[:CREATED]->(post:Post)
OPTIONAL MATCH (post:Post)<-[:LIKE]-(like:User)
MATCH (logged:User)
WHERE ID(post) = ${id} AND ID(logged) = 0
RETURN post, author, COLLECT(like) AS likes, 
CASE loggedID 
    WHEN null THEN false 
    ELSE EXISTS ((post:Post)<-[:LIKE]-(logged:User))
END AS liked`;

  const driver = DbConnector();
  const session = driver.session();

  const result = await session.run(query);
  driver.close();
  console.log(query);
  return {
    ...result.records[0].get('post').properties,
    latitude: parseFloat(result.records[0].get('post').properties.latitude),
    longitude: parseFloat(result.records[0].get('post').properties.longitude),
    id: result.records[0].get('post').identity.toNumber(),
    author: {
      id: result.records[0].get('author').identity.toNumber(),
      ...result.records[0].get('author').properties,
    },
    liked: result.records[0].get('liked'),
    likes: result.records[0]
      .get('likes')
      .map(
        (like: {
          properties: { firstName: string; lastName: string; username: string };
        }) => like.properties
      ),
  };
};

export default GetPostInfo;
