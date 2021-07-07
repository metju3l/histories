import DbConnector from '../database/driver';
import { CheckCredentials } from '../validator/';
// eslint-disable-next-line
const bcrypt = require('bcrypt');

const CheckPassword = async (input: { username: string; password: string }) => {
  if (CheckCredentials(input) !== '') return CheckCredentials(input);

  const userInfoQuery = `MATCH (n:User {username: "${input.username}"}) RETURN n`;

  const driver = DbConnector();
  const session = driver.session();

  const userInfo = await session.run(userInfoQuery);

  driver.close();

  return bcrypt.compareSync(
    input.password,
    userInfo.records[0].get('n').properties.password
  );
};

export default CheckPassword;
