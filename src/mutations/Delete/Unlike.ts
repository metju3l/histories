import RunCypherQuery from '../../database/RunCypherQuery';

// QUERY
/*
 * MATCH (user:User)-[like:LIKE]->(target)  - match like relation
 * WHERE ID(user) = 1 AND ID(target) = 2    - match nodes by IDs
 * DELETE like                              - delete relation
 */

const Like = async ({
  loggedID,
  id,
}: {
  loggedID: number;
  id: number;
}): Promise<void> => {
  await RunCypherQuery(`MATCH (user:User)-[like:LIKE]->(target)
  WHERE ID(user) = ${loggedID} AND ID(target) = ${id}
  DELETE like`);
};

export default Like;
