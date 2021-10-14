import RunCypherQuery from '../database/RunCypherQuery';
import { ValidateUsername } from '../validation';

type queryResult = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string | null;
  verified: boolean;
  created: number;
  following?: {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    bio: string | null;
  };
  followers?: {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    bio: string | null;
  };
  posts?: {
    id: number;
    description: string;
  };
};

const UserQuery = async ({
  logged,
  username,
  id,
}: {
  logged?: number;
  username?: string;
  id?: number;
}): Promise<queryResult> => {
  // if username and id are undefined
  if (username === undefined && id === undefined)
    throw new Error('Username or id required');

  // if username is filled in
  if (username) {
    const validateUsername = ValidateUsername(username).error;
    if (validateUsername) throw new Error(validateUsername);
  }

  const matchString =
    id !== undefined
      ? ` WHERE ID(user) = ${id} `
      : ` WHERE user.username =~ "(?i)${username}" `;

  const query = `
MATCH (user:User)${logged !== undefined ? `, (logged:User)` : ''}
${matchString}${logged !== undefined ? ` AND ID(logged) = ${logged}` : ''}
OPTIONAL MATCH (user:User)<-[:FOLLOW]-(follower:User)
${matchString}
OPTIONAL MATCH (user:User)-[:FOLLOW]->(following:User)
${matchString}
OPTIONAL MATCH (user:User)-[:CREATED]->(post:Post)-[:IS_LOCATED]->(place:Place)
${matchString}
RETURN user{.*,
  id: ID(user), 
  isFollowing: ${
    logged !== undefined ? `EXISTS( (logged)-[:FOLLOW]->(user) )` : 'false'
  },
  followers: COLLECT(DISTINCT follower{.*, id: ID(follower)}),
  following: COLLECT(DISTINCT following{.*, id: ID(following)}),
  posts: COLLECT(DISTINCT post{.*, id: ID(post), place:place{.*, id: ID(place)}})
} AS user`;

  const result = await RunCypherQuery(query);

  // If user doesn't exist
  if (result.records[0] === undefined) throw new Error('User does not exist');
  // else
  else return result.records[0].get('user') as queryResult;
};

export default UserQuery;
