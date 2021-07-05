import DbConnector from '../database/driver';
import { CheckCredentials, UserExists } from '../validator';

const Unfollow = async ({ from, to }: { from: string; to: string }) => {
  const checkFrom = CheckCredentials({
    username: from,
  });
  const checkTo = CheckCredentials({
    username: to,
  });

  if (checkFrom !== '') return checkFrom;
  if (checkTo !== '') return checkTo;

  if (from === to) return 'user cannot follow himself';
  if (await !UserExists(from)) return 'user from does not exist';
  if (await !UserExists(to)) return 'user to does not exist';

  const query = `MATCH (a:User {username: '${from}'})-[r:FOLLOW]->(b:User {username: '${to}'}) DELETE r`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'relation deleted';
};

export default Unfollow;
