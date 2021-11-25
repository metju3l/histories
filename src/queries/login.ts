import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import DbConnector from '../database/driver';

const Login = async (input: {
  username: string;
  password: string;
}): Promise<any | null> => {
  const userInfoQuery = `MATCH (user:User) 
  WHERE user.username =~ "(?i)${input.username}" 
  OR user.email = "${input.username.toLowerCase()}"
  RETURN user, ID(user) as id`;

  const driver = DbConnector();
  const session = driver.session();

  const userInfo = await session.run(userInfoQuery);
  driver.close();

  const id = userInfo.records[0].get('id');
  if (
    compareSync(
      input.password,
      userInfo.records[0].get('user').properties.password
    )
  )
    return sign(
      { username: userInfo.records[0].get('user').properties.username, id },
      process.env.JWT_SECRET!,
      {
        expiresIn: '120min',
      }
    );
  else return null;
};

export default Login;
