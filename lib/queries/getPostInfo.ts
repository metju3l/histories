import DbConnector from '../database/driver';

const GetPostInfo = async ({
  id,
  logged,
}: {
  id: number;
  logged: number | null;
}) => {
  const query = `
MATCH (author:User)-[:CREATED]->(post:Post)
OPTIONAL MATCH (post:Post)<-[:LIKE]-(like:User)
OPTIONAL MATCH (post:Post)<-[:CONTAINS]-(hashtag:Hashtag)
MATCH (logged:User)
WHERE ID(post) = ${id} 
RETURN post, author, COLLECT(like) AS likes, COLLECT(hashtag) AS hashtags`;

  const driver = DbConnector();
  const session = driver.session();

  const result = await session.run(query);
  driver.close();

  return {
    ...result.records[0].get('post').properties,
    hashtags: result.records[0]
      .get('hashtags')
      .map(
        (hashtag: { properties: { name: string } }) => hashtag.properties.name
      ),
    latitude: parseFloat(result.records[0].get('post').properties.latitude),
    longitude: parseFloat(result.records[0].get('post').properties.longitude),
    id: result.records[0].get('post').identity.toNumber(),
    author: {
      id: result.records[0].get('author').identity.toNumber(),
      ...result.records[0].get('author').properties,
    },
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
