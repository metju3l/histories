import RunCypherQuery from '../../database/RunCypherQuery';

// QUERY
/*
 * MATCH (user:User)-[:CREATED]->(collection:Collection)-[r:CONTAINS]->(post:Post)  // match user, collection and post
 * WHERE ID(collection) = $collectionId                                             // match collection by ID
 * AND ID(post) = $postId                                                           // match post by ID
 * AND ID(user) = $userId                                                           // match user by ID
 * DELETE r                                                                         // delete collection and post relation
 */

const RemovePostFromCollection = async ({
  userId,
  postId,
  collectionId,
}: {
  userId: number;
  postId: number;
  collectionId: number;
}): Promise<void> => {
  await RunCypherQuery(
    `MATCH (user:User)-[:CREATED]->(collection:Collection)-[r:CONTAINS]->(post:Post)
WHERE ID(collection) = $collectionId
AND ID(post) = $postId
AND ID(user) = $userId
DELETE r`,
    { userId, postId, collectionId }
  );
};

export default RemovePostFromCollection;
