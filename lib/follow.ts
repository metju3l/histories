import DbConnector from '../src/database/driver';
import UserExists from './userExists';

const Follow = async (input: any) => {
  if (input.from === input.to) return 'user cannot follow himself';
  if (await !UserExists(input.from)) return 'user from does not exist';
  if (await !UserExists(input.to)) return 'user to does not exist';

  const query = `MATCH
  (a:User),
  (b:User)
WHERE a.username = '${input.from}' AND b.username = '${input.to}'
CREATE (a)-[r:FOLLOW]->(b)`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'relation created';
};

export default Follow;
