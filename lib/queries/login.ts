import DbConnector from '../database/driver';
import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const Login = async (input: {
  username: string;
  password: string;
}): Promise<any | null> => {
  const userInfoQuery = `MATCH (n:User {username: "${input.username}"}) RETURN n, ID(n) as id`;

  const driver = DbConnector();
  const session = driver.session();

  const userInfo = await session.run(userInfoQuery);
  driver.close();

  const id = userInfo.records[0].get('id').toInt();
  if (
    compareSync(
      input.password,
      userInfo.records[0].get('n').properties.password!
    )
  )
    return sign({ username: input.username, id }, process.env.JWT_SECRET!, {
      expiresIn: '120min',
    });
  else return null;
};

export default Login;
