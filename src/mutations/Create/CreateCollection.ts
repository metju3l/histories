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
  const query = `MATCH (user:User) 
  WHERE ID(user) = $userId
  CREATE (user)-[:CREATED]->(collection:Collection {createdAt: $createdAt, name: $name, description: $description, preview: $preview})
  RETURN collection{.*, id: ID(collection)} as collection`;

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
