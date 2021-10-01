import DbConnector from '../database/driver';
import LastPost from './lastPost';

const CreatePost = async ({
  userID,
  description,
  hashtags,
  photoDate,
  longitude,
  latitude,
}: {
  userID: number;
  description: string;
  hashtags: string;
  photoDate: string;
  longitude: number;
  latitude: number;
}): Promise<string> => {
  // if last post / collection was created less than 10 seconds ago
  if (new Date().getTime() - parseInt(await LastPost({ userID })) < 10000)
    throw new Error('you can create post every 10sec');

  const query = `
  MATCH (user:User)
  WHERE ID(user) = ${userID} 
  CREATE (user)-[:CREATED]->(post:Post
  {
    description:"${description}",
    createdAt: ${new Date().getTime()},
    postDate: "${photoDate}",
    url: "https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
  })
  MERGE (place:Place {    
    longitude: ${longitude},
    latitude: ${latitude}
  })
  MERGE (post)-[:IS_LOCATED]->(place)
  RETURN ID(post) as id`;

  const driver = DbConnector();
  const session = driver.session();

  const postID = await (await session.run(query)).records[0]
    .get('id')
    .toNumber();

  await session.run(`WITH ${hashtags} AS tags
  MATCH (user:User), (post:Post)
  WHERE ID(post) = ${postID} AND ID(user) = ${userID} AND (user:User)-[:CREATED]->(post:Post)
  FOREACH (tag IN tags |
  MERGE (hashtag:Hashtag {name:tag})
  MERGE (hashtag)-[:CONTAINS]->(post)
  )`);

  driver.close();

  return 'post created';
};

export default CreatePost;
