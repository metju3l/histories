import DbConnector from '../../database/driver';
import { UserExists } from '../../validation';

const deleteUser = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<string> => {
  const query = `MATCH (n:User {username: "${username}"}) DETACH DELETE n`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return (await UserExists(username)) ? 'user deleted' : 'action failed';
};

export default deleteUser;
