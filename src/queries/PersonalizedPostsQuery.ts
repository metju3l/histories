import RunCypherQuery from '../database/RunCypherQuery';

// QUERY
/*
 * MATCH (user:User)                                          - match logged user
 * WHERE ID(user) = 92
 * CALL {
 *    WITH user                                               - get user
 *    OPTIONAL MATCH (author:User)-[:CREATED]->(post:Post)    - get posts created by followed users or by user
 *    WHERE ((user)-[:FOLLOW]->(author)) OR (user = author)
 *    RETURN post, author                                     - return posts and author
 *    ORDER BY post.createdAt DESC                            - order posts by date
 * }
 * RETURN COLLECT(DISTINCT post{.*, id: ID(post)}) AS posts   - return posts as object
 */

const PersonalizedPostsQuery = async (logged: number | null) => {
  const query =
    logged === null
      ? `
      MATCH (post:Post)
      RETURN COLLECT(post{.*, id: ID(post)}) AS posts LIMIT 125`
      : `MATCH (user:User)
      WHERE ID(user) = ${logged}
      CALL {
          WITH user
          OPTIONAL MATCH (author:User)-[:CREATED]->(post:Post)
          WHERE ((user)-[:FOLLOW]->(author)) OR (user = author)
          RETURN post, author
          ORDER BY post.createdAt DESC
      }
      RETURN COLLECT(DISTINCT post{.*, id: ID(post)}) AS posts`;

  const result = await RunCypherQuery(query);

  return result.records[0].get('posts');
};

export default PersonalizedPostsQuery;
