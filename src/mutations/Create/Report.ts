import RunCypherQuery from '@src/database/RunCypherQuery';

const Report = async ({
  logged,
  target,
}: {
  logged: number;
  target: number;
}) => {
  const query = `MATCH (user:User), (target)
  WHERE ID(user) = ${logged} AND ID(target) = ${target}
  MERGE (user)-[:REPORT {createdAt: ${new Date().getTime()}}]-(target)
  `;

  await RunCypherQuery(query);
  return 0;
};

export default Report;
