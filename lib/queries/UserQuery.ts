import DbConnector from '../database/driver';

const UserQuery = async (
  logged: string | null,
  username: string | undefined,
  userID: number | undefined,
  queries: any
): Promise<any> => {
  const matchString =
    userID !== undefined
      ? ` WHERE ID(n) = ${userID} `
      : ` WHERE n.username =~ "(?i)${username}" `;

  const userInfoQuery = `MATCH (n:User) ${matchString} RETURN n, ID(n)`;
  const followersQuery = `MATCH (n:User)<-[:FOLLOW]-(user) ${matchString} RETURN user`;
  const followingQuery = `MATCH (n:User)-[:FOLLOW]->(user) ${matchString} RETURN user`;
  const collectionsQuery = `MATCH (n:User)-[:CREATED]->(collection:Collection) ${matchString} RETURN collection`;
  const postsQuery = `MATCH (n:User)-[:CREATED]->(post:Post) ${matchString} RETURN post ORDER BY post.createdAt DESC`;
  const isFollowingQuery = logged
    ? `MATCH (:User {username: "${logged}"})-[r:FOLLOW]->(n:User) ${matchString} RETURN r`
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
        id: userInfo.records[0].get('ID(n)').toNumber(),
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
                  id: x.get('post').identity.toNumber(),
                };
              })
            : null,
      };
};

export default UserQuery;
