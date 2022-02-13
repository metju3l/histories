import RunCypherQuery from '../../../database/RunCypherQuery';

const UserQuery = async ({
  logged,
  id,
}: {
  logged: number | null;
  id: number;
}): Promise<any> => {
  const query = `MATCH (author:User)-[:CREATED]->(collection:Collection)
  WHERE ID(collection) = $id

  CALL {
      WITH collection
      OPTIONAL MATCH (collection)-[:CONTAINS]->(post:Post)<-[:CREATED]-(postAuthor:User)
      RETURN post, postAuthor
      LIMIT 50
  }
  
  CALL {
    WITH collection
    OPTIONAL MATCH (collection)-[:CONTAINS]->(post)
    RETURN COUNT(DISTINCT post) AS postCount
  }

  CALL {
      WITH postAuthor
      OPTIONAL MATCH (follower:User)-[:FOLLOW]->(postAuthor)
      OPTIONAL MATCH (postAuthor)-[:FOLLOW]->(following:User)
      RETURN COUNT(DISTINCT follower) AS postAuthorFollowerCount,
          COUNT(DISTINCT following) AS postAuthorFollowingCount
  }
   
  CALL {
      WITH author
      OPTIONAL MATCH (follower:User)-[:FOLLOW]->(author)
      OPTIONAL MATCH (author)-[:FOLLOW]->(following:User)
      RETURN COUNT(DISTINCT follower) AS followerCount,
          COUNT(DISTINCT following) AS followingCount
  }
  
  
  RETURN collection{.*, 
          id: ID(collection),
          postCount,  
          posts: COLLECT(DISTINCT post{.*,
                  id: ID(post),
                  author:
                      postAuthor{.*,
                      id: ID(postAuthor),
                      followerCount: postAuthorFollowerCount,
                      followingCount: postAuthorFollowingCount
                  }
              }),
          author: author{.*,
              id: ID(author),
              followerCount,
              followingCount
          }
      } AS collection`;

  const [result] = await RunCypherQuery({ query, params: { id } });

  // If Collection doesn't exist
  if (result.records[0] === undefined)
    throw new Error('Collection does not exist');
  // else
  else return result.records[0].get('collection');
};

export default UserQuery;
