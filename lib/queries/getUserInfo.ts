import DbConnector from '../database/driver';
import { CheckCredentials } from '../validator/';

const GetUserInfo = async (
  logged: string | null,
  username: string,
  queries: any
): Promise<any> => {
  if (CheckCredentials({ username: username }) !== '')
    return CheckCredentials({ username: username });

  const userInfoQuery = `MATCH (n:User) WHERE n.username =~ "(?i)${username}" RETURN n, ID(n)`;
  const followersQuery = `MATCH (a:User {username: "${username}"})<-[:FOLLOW]-(user) RETURN user`;
  const followingQuery = `MATCH (a:User {username: "${username}"})-[:FOLLOW]->(user) RETURN user`;
  const collectionsQuery = `MATCH (a:User {username: "${username}"})-[:CREATED]->(collection:Collection) RETURN collection`;
  const postsQuery = `MATCH (user:User {username: "${username}"})-[:CREATED]->(post:Post) RETURN post`;
  const isFollowingQuery = logged
    ? `MATCH (:User {username: "${logged}"})-[r:FOLLOW]->(:User {username: "${username}"}) RETURN r`
    : '';
  // const followQuery = `RETURN {follows:EXISTS((:User {username: ${username}})<-[:FOLLOW]-(:User {username:${logged}})),isFollowed:EXISTS((:User {username:${logged}})<-[:FOLLOW]-(:User {username:${username}}))}`;

  const driver = DbConnector();
  const session = driver.session();

  const posts = await session.run(postsQuery);
  const isFollowing = logged ? await session.run(isFollowingQuery) : false;
  const userInfo = await session.run(userInfoQuery);
  const following = (await session.run(followingQuery)).records.map((x) => {
    return x.get('user').properties;
  });
  const followers = (await session.run(followersQuery)).records.map((x) => {
    return x.get('user').properties;
  });
  const collections = (await session.run(collectionsQuery)).records.map((x) => {
    return x.get('collection').properties;
  });
  driver.close();

  return userInfo.records[0] === undefined
    ? null
    : {
        ...userInfo.records[0].get('n').properties,
        userID: userInfo.records[0].get('ID(n)').toNumber(),
        // @ts-ignore
        isFollowing: logged ? isFollowing.records[0] !== undefined : false,
        following,
        followers,
        collections,
        posts:
          posts !== null
            ? posts.records.map((x) => {
                return {
                  ...x.get('post').properties,
                  postID: x.get('post').identity.toNumber(),
                };
              })
            : null,
      };
};

export default GetUserInfo;
