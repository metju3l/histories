import RunCypherQuery from '../../database/RunCypherQuery';

// QUERY
/*
 * MATCH (user:User), (target)
 * WHERE ID(user) = 1 AND ID(target) = 3                        - match nodes by IDs
 * AND (target: User OR target: Hashtag OR target: Place)       - can follow only nodes with these labels
 * AND NOT EXISTS((user)-[:FOLLOW]->(target))                   - only create relation when there isn't one already
 * CREATE (user)-[:FOLLOW {createdAt: 1635490076649}]->(target) - create relation + set relation property createdAt - epoch time
 */

const Follow = async (logged: number, target: number): Promise<void> => {
  await RunCypherQuery(`MATCH (user:User), (target) WHERE ID(user) = ${logged} AND ID(target) = ${target}
AND (target: User OR target: Hashtag OR target: Place) AND NOT EXISTS((user)-[:FOLLOW]->(target))
CREATE (user)-[:FOLLOW {createdAt: ${new Date().getTime()}}]->(target)`);
};

export default Follow;
