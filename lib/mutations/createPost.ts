import DbConnector from '../database/driver';
import { CheckCredentials, UserExists } from '../validator/';

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
  const query = `MATCH (n:User {username: "${userID}"})
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

  console.log(query);
  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'post created';
};

export default CreatePost;
