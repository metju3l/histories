import GetUserInfo from '@lib/queries/getUserInfo';
import DbConnector from '../database/driver';
import { CheckCredentials, UserExists } from '../validator';

const Like = async ({
  logged,
  id,
  type,
}: {
  logged: string;
  id: number;
  type: string;
}): Promise<string> => {
  if (logged === null) return 'user not logged in';
  const loggedID = (await GetUserInfo(null, logged, null)).userID;
  const query = `MATCH (user:User), (object)
  WHERE user.username = "${logged}" AND ID(object) = ${id}
  CREATE (user)-[:LIKE {type:"${type}"}]->(object)`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'relation created';
};

export default Like;
