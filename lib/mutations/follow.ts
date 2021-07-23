import DbConnector from '../database/driver';
import { CheckCredentials, UserExists } from '../validator';

const Follow = async (logged: string, username: string): Promise<string> => {
  console.log(logged);
  if (
    CheckCredentials({
      username: username,
    }) !== ''
  )
    return CheckCredentials({
      username: username,
    });

  if (logged === username) return 'user cannot follow himself';
  if (!UserExists(username)) return 'user from does not exist';

  const query = `MATCH
  (a:User {username: "${logged}"}),
  (b:User {username: "${username}"})
  CREATE (a)-[r:FOLLOW {createdAt: ${new Date().getTime()}}]->(b)`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'relation created';
};

export default Follow;
