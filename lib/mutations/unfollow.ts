import UserQuery from '@lib/queries/UserQuery';
import DbConnector from '../database/driver';

const Unfollow = async (logged: string, userID: number): Promise<string> => {
  if (logged === null) return 'user not logged in';
  const loggedID = (await UserQuery(null, logged, undefined, null)).id;
  const query = `MATCH (a)-[r:FOLLOW]->(b)
  WHERE ID(a) = ${loggedID} AND ID(b) = ${userID}
  DELETE r`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'relation created';
};

export default Unfollow;
