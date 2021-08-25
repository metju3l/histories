import GetUserInfo from '@lib/queries/getUserInfo';
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
  userID: string;
  description: string;
  hashtags: string;
  photoDate: string;
  longitude: string;
  latitude: string;
}): Promise<string> => {
  const actualID = (await GetUserInfo(null, userID, undefined, null)).id;

  // if last post / collection was created less than 10 seconds ago
  if (
    new Date().getTime() - parseInt(await LastPost({ userID: actualID })) <
    10000
  )
    return 'you can only create post every 10sec';

  const query = `
  MATCH (n:User {username: "${userID}"})
  CREATE (n)-[:CREATED]->(:Post
  {
    description:"${description}",
    hashtags:"${hashtags}",
    createdAt: "${new Date().getTime()}",
    photoDate: "${photoDate}",
    longitude: "${longitude}",
    latitude: "${latitude}",
    url: "https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
  })`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'post created';
};

export default CreatePost;
