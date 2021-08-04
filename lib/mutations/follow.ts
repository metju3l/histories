import GetUserInfo from '@lib/queries/getUserInfo';
import DbConnector from '../database/driver';
import { CheckCredentials, UserExists } from '../validator';

const Follow = async (logged: string, userID: number): Promise<string> => {
  if (logged === null) return 'user not logged in';
  const loggedID = (await GetUserInfo(null, logged, null)).userID;
  const query = `MATCH (a:User), (b:User)
  WHERE ID(a) = ${loggedID} AND ID(b) = ${userID}
  CREATE (a)-[r:FOLLOW {createdAt: ${new Date().getTime()}}]->(b)`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'relation created';
};

export default Follow;
