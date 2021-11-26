import RunCypherQuery from '../../database/RunCypherQuery';

// QUERY
/*
 * MATCH (user:User)-[:CREATED]->(collection:Collection), (post:Post)   // match user, collection and post
 * WHERE ID(user) = $userId                                             // match user by ID
 * AND ID(post) = $postId                                               // match post by ID
 * AND ID(collection) = $collectionId                                   // match collection by ID
 * MERGE (collection)-[r:CONTAINS]->(post)                              // merge
 *     SET r.createdAt = $createdAt                                     // set createdAt to relation
 */

const AddPostToCollection = async ({
  userId,
  postId,
  collectionId,
}: {
  userId: number;
  postId: number;
  collectionId: number;
}): Promise<void> => {
  await RunCypherQuery(
    `MATCH (user:User)-[:CREATED]->(collection:Collection), (post:Post)
WHERE ID(user) = $userId
AND ID(post) = $postId
AND ID(collection) = $collectionId
MERGE (collection)-[r:CONTAINS]->(post) SET r.createdAt = $createdAt`,
    { userId, postId, collectionId, createdAt: new Date().getTime() }
  );
};

export default AddPostToCollection;
