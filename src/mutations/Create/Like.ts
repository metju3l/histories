import RunCypherQuery from '../../database/RunCypherQuery';

// QUERY
/*
 * MATCH (user:User), (target)
 * WHERE ID(user) = 1 AND ID(target) = 4  - match nodes by IDs
 * AND (target :Post)                     - only like these labels
 * MERGE (user)-[r:LIKE]->(target)        - merge - in case user wants to change type (no need to delete and create like again)
 * SET r.createdAt = 1635490076649,       - created at
 *     r.type = "like"                    - like types -> like | haha | love | sad...
 */

const Like = async ({
  logged,
  target,
  type,
}: {
  logged: number;
  target: number;
  type: string;
}): Promise<void> => {
  await RunCypherQuery(`MATCH (user:User), (target) WHERE ID(user) = ${logged} AND ID(target) = ${target} AND (target: Post)
MERGE (user)-[r:LIKE]->(target) SET r.createdAt = ${new Date().getTime()}, r.type = "${type}"`);
};

export default Like;
