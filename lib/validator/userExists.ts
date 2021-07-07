import DbConnector from '../database/driver';

const UserExists = async (user: string): Promise<boolean> => {
  const userInfoQuery = `MATCH (n:User {${
    user.includes('@') ? 'email' : 'username'
  }: "${user}"}) RETURN n`;

  const driver = DbConnector();
  const session = driver.session();

  const userInfo = await session.run(userInfoQuery);

  driver.close();

  return userInfo.records[0] === undefined ? false : true;
};

export default UserExists;
