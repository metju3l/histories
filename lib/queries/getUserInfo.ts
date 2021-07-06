import DbConnector from '../database/driver';

const GetUserInfo = async (username: string, queries: any) => {
  const userInfoQuery = `MATCH (n:User {username: "${username}"}) RETURN n`;
  const followersQuery = `MATCH (a:User {username: "${username}"})<-[:FOLLOW]-(user) RETURN user`;
  const followingQuery = `MATCH (a:User {username: "${username}"})-[:FOLLOW]->(user) RETURN user`;

  const driver = DbConnector();
  const session = driver.session();

  const userInfo = await session.run(userInfoQuery);
  const following =
    queries.find((x: any) => x.name.value === 'following') !== undefined &&
    (await session.run(followingQuery)).records.map((x) => {
      return x.get('user').properties;
    });
  const followers =
    queries.find((x: any) => x.name.value === 'followers') !== undefined &&
    (await session.run(followersQuery)).records.map((x) => {
      return x.get('user').properties;
    });
  driver.close();

  return userInfo.records[0] === undefined
    ? null
    : { ...userInfo.records[0].get('n').properties, following, followers };
};

export default GetUserInfo;
