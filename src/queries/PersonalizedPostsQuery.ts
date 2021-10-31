import RunCypherQuery from '../database/RunCypherQuery';

const PersonalizedPostsQuery = async (logged: number | null) => {
  const query =
    logged === null
      ? `
      MATCH (post:Post)
      RETURN COLLECT(post{.*, id: ID(post)}) AS posts LIMIT 125`
      : `
      OPTIONAL MATCH (user:User), (author:User)-[:CREATED]->(post:Post)
      WHERE ID(author) = ${logged} OR ((user)-[:FOLLOW]->(author:User) AND ID(user) = ${logged})
      RETURN COLLECT(DISTINCT post{.*, id: ID(post)}) AS posts`;

  const result = await RunCypherQuery(query);

  return result.records[0].get('posts');
};

export default PersonalizedPostsQuery;
