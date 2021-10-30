import DbConnector from '../../database/driver';
import LastPost from '../lastPost';

const CreatePost = async ({
  userID,
  description,
  hashtags,
  photoDate,
  longitude,
  latitude,
  url,
}: {
  userID: number;
  description: string;
  hashtags: string;
  photoDate: string;
  longitude: number;
  latitude: number;
  url: string;
}): Promise<string> => {
  // if last post / collection was created less than 10 seconds ago
  if (new Date().getTime() - parseInt(await LastPost({ userID })) < 10000)
    throw new Error('you can create post every 10sec');

  const query = `
  MATCH (user:User)
  WHERE ID(user) = ${userID} 
  CREATE (user)-[:CREATED]->(post:Post
  {
    description: "${description}",
    createdAt: ${new Date().getTime()},
    postDate: ${photoDate},
    url: "${url}",
    nsfw: false,
    edited: false,
    public: true
  })
  MERGE (place:Place {    
    longitude: ${longitude},
    latitude: ${latitude},
    location: point({longitude: ${longitude}, latitude: ${latitude}, srid: 4326})
  })
  MERGE (post)-[:IS_LOCATED]->(place)
  RETURN ID(post) as id`;

  const driver = DbConnector();
  const session = driver.session();

  const postID = await (await session.run(query)).records[0].get('id');

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
