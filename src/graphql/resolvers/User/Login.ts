import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import {
  ValidateEmail,
  ValidatePassword,
  ValidateUsername,
} from '../../../../shared/validation';
import RunCypherQuery from '../../../database/RunCypherQuery';

const Login = async ({
  name,
  password,
}: {
  name: string;
  password: string;
}): Promise<any | null> => {
  // check user input
  if (
    (ValidateUsername(name).error && ValidateEmail(name).error) ||
    ValidatePassword(password).error
  )
    throw new Error('Wrong credentials');

  const query = `
  MATCH (user:User) 
  // where incasesensitive username or email matches 
  WHERE user.username =~ $name  
    XOR user.email =~ $name  // using XOR to avoid checking both username and email at the same time (which would potentially make a brute force attack faster)
  RETURN user{.*, id: ID(user)} as user
  `;

  // run query
  const [userInfo] = await RunCypherQuery({
    query,
    params: {
      name: `(?i)${name}`, // (?i) = case insensitive
    },
  });

  // if password matches
  if (compareSync(password, userInfo.records[0].get('user').password))
    return sign(
      // JWT payload
      {
        username: userInfo.records[0].get('user').username,
        id: userInfo.records[0].get('user').id,
      },
      process.env.JWT_SECRET!, // JWT secret
      {
        expiresIn: '360min', // JWT token expiration
      }
    );
  // else throw error
  else throw new Error('Wrong credentials');
};

export default Login;
