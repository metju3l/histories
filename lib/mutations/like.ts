import UserQuery from '@lib/queries/UserQuery';
import DbConnector from '../database/driver';

const Like = async ({
  logged,
  id,
  type,
  to,
}: {
  logged: string;
  id: number;
  type: string;
  to: string;
}): Promise<string> => {
  const formatedTo = to[0].toUpperCase() + to.slice(1).toLowerCase();
  const enabledObjects = ['Post', 'Collection', 'Path'];

  if (!enabledObjects.includes(formatedTo)) return 'wrong object';
  if (logged === null) return 'user not logged in';
  const loggedID = (await UserQuery({ username: logged })).id;
  const query = `MATCH (user:User), (object:${formatedTo})
  WHERE ID(user) = ${loggedID} AND ID(object) = ${id}
  CREATE (user)-[:LIKE {type:"${type}"}]->(object)`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'relation created';
};

export default Like;
