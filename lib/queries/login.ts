import DbConnector from '../database/driver';
import { CheckCredentials } from '../validator';
import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const Login = async (input: {
  username: string;
  password: string;
}): Promise<string> => {
  if (CheckCredentials(input) !== '') return CheckCredentials(input);

  const userInfoQuery = `MATCH (n:User {username: "${input.username}"}) RETURN n`;

  const driver = DbConnector();
  const session = driver.session();

  const userInfo = await session.run(userInfoQuery);

  driver.close();

  if (
    compareSync(
      input.password,
      userInfo.records[0].get('n').properties.password
    )
  )
    return sign({ username: input.username }, process.env.JWT_SECRET!, {
      expiresIn: '120min',
    });
  else return 'error';
};

export default Login;
