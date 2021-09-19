import DbConnector from '../database/driver';

const PerosnalizedPostsQuery = async (logged: number | null) => {
  const query =
    logged === null
      ? `
MATCH (post:Post)
RETURN COLLECT(post) AS posts LIMIT 125`
      : `
MATCH (user:User)-[:FOLLOW]->(author:User)-[:CREATED]->(post:Post)
WHERE ID(user) = ${logged}
RETURN COLLECT(post) AS posts`;

  const driver = DbConnector();
  const session = driver.session();

  const result = await session.run(query);
  driver.close();

  return result.records[0].get('posts').map(
    (node: {
      identity: any;
      properties: {
        description: string;
        url: string;
      };
    }) => ({
      id: node.identity.toNumber(),
    })
  );
};

export default PerosnalizedPostsQuery;
