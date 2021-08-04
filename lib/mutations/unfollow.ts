import GetUserInfo from '@lib/queries/getUserInfo';
import DbConnector from '../database/driver';
import { CheckCredentials, UserExists } from '../validator';

const Unfollow = async (logged: string, userID: number): Promise<string> => {
  console.log('unfollow');
  if (logged === null) return 'user not logged in';
  const loggedID = (await GetUserInfo(null, logged, null)).userID;
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
