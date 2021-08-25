import GetUserInfo from '@lib/queries/getUserInfo';
import DbConnector from '../database/driver';

const Like = async ({
  logged,
  id,
}: {
  logged: string;
  id: number;
}): Promise<string> => {
  if (logged === null) return 'user not logged in';
  const loggedID = (await GetUserInfo(null, logged, undefined, null)).id;
  const query = `MATCH (n:User)-[like:LIKE]->(m)
                WHERE ID(n) = ${loggedID} AND ID(m) = ${id}
                DELETE like`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'relation created';
};

export default Like;
