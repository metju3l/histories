import axios from 'axios';
import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { LoginInput } from '../../../../.cache/__types__';
import {
  ValidateEmail,
  ValidatePassword,
  ValidateUsername,
} from '../../../../shared/validation';
import RunCypherQuery from '../../../database/RunCypherQuery';

const Login = async ({
  username,
  password,
  googleJWT,
}: LoginInput): Promise<any | null> => {
  const query = `
  MATCH (user:User) 
  // where incasesensitive username or email matches 
  WHERE user.username =~ $name  
    XOR user.email =~ $name  // using XOR to avoid checking both username and email at the same time (which would potentially make a brute force attack faster)
  RETURN user{.*, id: ID(user)} as user
  `;

  if (googleJWT) {
    try {
      // validate token
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleJWT}`
      );

      // get user data from neo4j
      const [userInfo] = await RunCypherQuery({
        query,
        params: {
          name: `(?i)${res.data.email}`, // (?i) = case insensitive
        },
      });

      // create and return jwt
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
    } catch (error: any) {
      throw new Error(error);
    }
  } else if (username && password) {
    // check user input
    if (
      (ValidateUsername(username).error && ValidateEmail(username).error) ||
      ValidatePassword(password).error
    )
      throw new Error('Wrong credentials');

    // run query
    const [userInfo] = await RunCypherQuery({
      query,
      params: {
        name: `(?i)${username}`, // (?i) = case insensitive
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
  } else throw new Error('Wrong credentials');
};

export default Login;
