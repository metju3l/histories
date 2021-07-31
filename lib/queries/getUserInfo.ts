import DbConnector from '../database/driver';
import { CheckCredentials } from '../validator/';

const GetUserInfo = async (username: string, queries: any): Promise<any> => {
  if (CheckCredentials({ username: username }) !== '')
    return CheckCredentials({ username: username });

  const finalQuery = `
  MATCH (user:User)
  MATCH (user:User)<-[:FOLLOW]-(follower:User)
  MATCH (user:User)-[:FOLLOW]->(following:User)
  WHERE user.username =~ "(?i)${username}"
  RETURN user, ID(user) AS userID, follower, following
  `;

  const driver = DbConnector();
  const session = driver.session();

  const result = await session.run(finalQuery);

  // if query returns data, user exists
  const userExists = result.records[0] !== undefined;

  if (userExists) {
    // get user info
    const userInfo = {
      ...result.records[0].get('user').properties,
      userID: result.records[0].get('userID').toNumber(),
    };

    // get followers
    const followers = await (
      await session.run(finalQuery)
    ).records.map((x) => {
      return x.get('follower').properties;
    });
    // get following
    const following = await (
      await session.run(finalQuery)
    ).records.map((x) => {
      return x.get('following').properties;
    });
    await driver.close();
    // return user data
    return { ...userInfo, followers, following };
  }
  // return null if user does not exist
  else {
    await driver.close();
    return null;
  }
};

export default GetUserInfo;
