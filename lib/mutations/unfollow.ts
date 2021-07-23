import DbConnector from '../database/driver';
import { CheckCredentials, UserExists } from '../validator';

const Unfollow = async (username: string): Promise<string> => {
  const checkTo = CheckCredentials({
    username: username,
  });

  if (checkTo !== '') return checkTo;

  if (username === username) return 'user cannot follow himself';
  if (await !UserExists(username)) return 'user to does not exist';

  const query = `MATCH (a:User {username: '${username}'})-[r:FOLLOW]->(b:User {username: '${username}'}) DELETE r`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'relation deleted';
};

export default Unfollow;
