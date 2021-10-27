import RunCypherQuery from '../../database/RunCypherQuery';

const Like = async ({
  loggedID,
  id,
}: {
  loggedID: number;
  id: number;
}): Promise<string> => {
  const query = `MATCH (user:User)-[like:LIKE]->(target)
WHERE ID(user) = ${loggedID} AND ID(target) = ${id}
DELETE like`;

  await RunCypherQuery(query);

  return 'relation created';
};

export default Like;
