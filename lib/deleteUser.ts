import DbConnector from './database/driver';
import UserExists from './validator/userExists';

const deleteUser = async (input: any) => {
  if (await UserExists(input.user)) return 'user does not exist';

  const query = `MATCH (n:User {${
    input.user.includes('@') ? 'email' : 'username'
  }: "${input.user}"}) DETACH DELETE n`;

  const driver = DbConnector();
  const session = driver.session();

  const result = await session.run(query);
  driver.close();

  if (await UserExists(input.user)) return 'user deleted';
  else return 'action failed';
};

export default deleteUser;
