import RunCypherQuery from '../../database/RunCypherQuery';

const CreateCollection = async ({
  userId,
  name,
  description,
  preview,
}: {
  userId: number;
  name: string;
  description: string;
  preview: String;
}): Promise<number> => {
  // limit to max 50 collections
  const query = `MATCH (user:User)
WHERE ID(user) = $userId
CALL { 
    WITH user
    OPTIONAL MATCH (user:User)-[:CREATED]->(collection:Collection)
    WITH SIZE(COLLECT(DISTINCT collection)) AS collectionCount, user
    WHERE SIZE(COLLECT(DISTINCT collection)) < 5O
    CREATE (user)-[:CREATED]->(newCollection:Collection {createdAt: $createdAt, name: $name, description: $description, preview: $preview})
    RETURN newCollection
}
RETURN newCollection{.*, id: ID(newCollection)} AS collection`;

  await RunCypherQuery(query, {
    createdAt: new Date().getTime(),
    description,
    name,
    userId,
    preview,
  });
  return 0;
};

export default CreateCollection;
