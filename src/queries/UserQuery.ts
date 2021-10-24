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

  const isLogged = logged != undefined;
  const matchString =
    id !== undefined
      ? ` WHERE ID(user) = ${id} `
      : ` WHERE user.username =~ "(?i)${username}" `;

  const query = `MATCH (user:User), (logged:User)
  ${matchString} ${isLogged ? `AND ID(logged) = ${logged}` : ''}
  CALL {
      WITH user
      OPTIONAL MATCH (user)-[created:CREATED]->(post:Post)-[:IS_LOCATED]->(place:Place)
      RETURN DISTINCT post, place
      ORDER BY post.createdAt DESC
      LIMIT 100
  }
  CALL {
      WITH user
      OPTIONAL MATCH (user)-[:FOLLOW]->(following:User)
      RETURN DISTINCT following
      LIMIT 100
  }
  CALL {
      WITH user
      OPTIONAL MATCH (follower:User)-[:FOLLOW]->(user)
      RETURN DISTINCT follower
      LIMIT 100
  }
  CALL {
    WITH user
    OPTIONAL MATCH (user)-[:CREATED]->(collection:Collection)
    RETURN DISTINCT collection
    LIMIT 100
}
  ${
    isLogged
      ? `CALL {
    WITH user,logged
    OPTIONAL MATCH (logged)-[r:FOLLOW]->(user)
    RETURN r AS isFollowing
}`
      : ''
  }

  RETURN user{.*, id: ID(user),
      posts: COLLECT(DISTINCT post{.*, id: ID(post), place:place{.*, id: ID(place)}}),
      followers: COLLECT(DISTINCT follower{.*, id: ID(follower)}), 
      following: COLLECT(DISTINCT following{.*, id: ID(following)}),
      collections: COLLECT(DISTINCT collection{.*, id: ID(collection)}),
      isFollowing: ${!isLogged ? 'false' : 'COUNT(isFollowing) '}      
  } AS user`;

  const result = await RunCypherQuery(query);

  // If user doesn't exist
  if (result.records[0] === undefined) throw new Error('User does not exist');
  // else
  else return result.records[0].get('user') as queryResult;
};

export default UserQuery;
