import RunCypherQuery from '../../database/RunCypherQuery';

const Like = async ({
  logged,
  target,
  type,
}: {
  logged: number;
  target: number;
  type: string;
}): Promise<string> => {
  const query = `MATCH (user:User), (target)
WHERE ID(user) = ${logged} AND ID(target) = ${target}
MERGE (user)-[r:LIKE]->(target)
SET r.createdAt = ${new Date().getTime()},
r.type = "${type}"`;

  await RunCypherQuery(query);

  return 'relation created';
};

export default Like;
