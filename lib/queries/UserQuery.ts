import DbConnector from '../database/driver';

type queryResult = {
  id: Number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string | null;
  verified: boolean;
  created: Number;
  following?: {
    id: Number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    bio: string | null;
  };
  followers?: {
    id: Number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    bio: string | null;
  };
  posts?: {
    id: Number;
    description: string;
  };
};

const UserQuery = async (
  logged: string | null,
  username: string | undefined,
  userID: number | undefined,
  queries: any
): Promise<queryResult> => {
  const matchString =
    userID !== undefined
      ? ` WHERE ID(user) = ${userID} `
      : ` WHERE user.username =~ "(?i)${username}" `;

  const query = `
MATCH (user:User)
${matchString}
OPTIONAL MATCH (user:User)<-[:FOLLOW]-(follower:User)
${matchString}
OPTIONAL MATCH (user:User)-[:FOLLOW]->(following:User)
${matchString}
OPTIONAL MATCH (user:User)-[:CREATED]->(post:Post)-[:IS_LOCATED]->(place:Place)
${matchString}
RETURN user{.*,
  id: ID(user), 
  followers: COLLECT(DISTINCT follower{.*, id: ID(follower)}),
  following: COLLECT(DISTINCT following{.*, id: ID(following)}),
  posts: COLLECT(DISTINCT post{.*, id: ID(post), place:place{.*, id: ID(place)}})
} AS user`;

  const driver = DbConnector();
  const session = driver.session();
  const result = await session.run(query);
  driver.close();

  return result.records[0].get('user') as queryResult;
};

export default UserQuery;
