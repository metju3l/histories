import DbConnector from '../database/driver';
import { CheckCredentials } from '../validator/';

const GetUserInfo = async (username: string, queries: any): Promise<any> => {
  if (CheckCredentials({ username: username }) !== '')
    return CheckCredentials({ username: username });

  const userInfoQuery = `MATCH (n:User) WHERE n.username =~ "(?i)${username}" RETURN n, ID(n)`;
  const followersQuery = `MATCH (a:User {username: "${username}"})<-[:FOLLOW]-(user) RETURN user`;
  const followingQuery = `MATCH (a:User {username: "${username}"})-[:FOLLOW]->(user) RETURN user`;
  const collectionsQuery = `MATCH (a:User {username: "${username}"})-[:CREATED]->(collection:Collection) RETURN collection`;

  const driver = DbConnector();
  const session = driver.session();

  const userInfo = await session.run(userInfoQuery);
  const following =
    queries.find(
      (x: { name: { value: string } }) => x.name.value === 'following'
    ) !== undefined &&
    (await session.run(followingQuery)).records.map((x) => {
      return x.get('user').properties;
    });
  const followers =
    queries.find(
      (x: { name: { value: string } }) => x.name.value === 'followers'
    ) !== undefined &&
    (await session.run(followersQuery)).records.map((x) => {
      return x.get('user').properties;
    });
  const collections =
    queries.find((x: any) => x.name.value === 'collections') !== undefined &&
    (await session.run(collectionsQuery)).records.map((x) => {
      return x.get('collection').properties;
    });
  driver.close();

  return userInfo.records[0] === undefined
    ? null
    : {
      ...userInfo.records[0].get('n').properties,
      id: userInfo.records[0].get('ID(n)').toNumber(),
      following,
      followers,
      collections,
    };
};

export default GetUserInfo;
