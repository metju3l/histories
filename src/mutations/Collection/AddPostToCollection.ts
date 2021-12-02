import RunCypherQuery from '../../database/RunCypherQuery';

const AddPostToCollection = async ({
  userId,
  postId,
  collectionId,
}: {
  userId: number;
  postId: number;
  collectionId: number;
}): Promise<void> => {
  const query = `
  MATCH (user:User)-[:CREATED]->(collection:Collection), (post:Post)
  WHERE ID(user) = $userId
    AND ID(post) = $postId
    AND ID(collection) = $collectionId
  MERGE (collection)-[r:CONTAINS]->(post)
  SET r.createdAt = $createdAt
  `;

  await RunCypherQuery({
    query,
    params: { userId, postId, collectionId, createdAt: new Date().getTime() },
  });
};

export default AddPostToCollection;
