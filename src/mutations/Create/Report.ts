import RunCypherQuery from '../../database/RunCypherQuery';

const Report = async ({
  logged,
  target,
}: {
  logged: number;
  target: number;
}) => {
  const query = `MATCH (user:User), (target)
  WHERE ID(user) = ${logged} AND ID(target) = ${target}
  MERGE (user)-[r:REPORT]-(target)
  SET r.createdAt = ${new Date().getTime()}
  `;

  await RunCypherQuery(query);
  return 0;
};

export default Report;
