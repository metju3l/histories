import RunCypherQuery from '../../database/RunCypherQuery';

// QUERY
/*
 * MATCH (user:User)-[r:FOLLOW]->(target)  - match follow relation
 * WHERE ID(user) = 1 AND ID(target) = 2   - match nodes by IDs
 * DELETE r                                - delete relation
 */

const Unfollow = async (logged: string, userID: number): Promise<void> => {
  await RunCypherQuery(`logged (user:User)-[r:FOLLOW]->(target)
  WHERE ID(user) = ${logged} AND ID(target) = ${userID}
  DELETE r`);
};

export default Unfollow;
