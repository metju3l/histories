import DbConnector from '../database/driver';
import { CheckCredentials, UserExists } from '../validator';

const DeletePost = async ({
  logged,
  postID,
}: {
  logged: string;
  postID: number;
}): Promise<string> => {
  const query = `MATCH (user:User)-[:CREATED]->(post:Post)
  WHERE user.username = "${logged}" AND ID(post) = ${postID}
  DETACH DELETE post`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'post deleted';
};

export default DeletePost;
