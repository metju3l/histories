import DbConnector from '../database/driver';

const SuggestedUsersQuery = async (logged: number | null) => {
  const loggedQuery = `MATCH (logged:User)
  WHERE ID(logged) = ${logged}
  MATCH (user:User)
  WHERE NOT (logged)-[:FOLLOW]->(user) AND NOT user = logged
  RETURN collect(user) AS suggestions LIMIT 15`;
  const query =
    logged !== null
      ? loggedQuery
      : `MATCH (user:User) RETURN collect(user) AS suggestions LIMIT 15`;

  const driver = DbConnector();
  const session = driver.session();
  const result = await session.run(query);
  driver.close();

  return result.records[0].get('suggestions').map(
    (node: {
      identity: any;
      properties: {
        username: string;
        email: string;
        createdAt: string;
        firstName: string;
        lastName: string;
      };
    }) => ({
      ...node.properties,
      id: node.identity.toNumber(),
    })
  );
};

export default SuggestedUsersQuery;
