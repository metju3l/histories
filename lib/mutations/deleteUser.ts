import DbConnector from '../database/driver';
import { CheckCredentials, UserExists } from '../validator';

const deleteUser = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const checkInput = CheckCredentials({
    username: username,
    password: password,
  });

  if (checkInput !== '') return checkInput;
  if (await UserExists(username)) return 'user does not exist';

  const query = `MATCH (n:User {username: "${username}"}) DETACH DELETE n`;

  const driver = DbConnector();
  const session = driver.session();

  const result = await session.run(query);
  driver.close();

  return (await UserExists(username)) ? 'user deleted' : 'action failed';
};

export default deleteUser;
