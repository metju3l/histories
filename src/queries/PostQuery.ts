import { ParseUrls } from '../functions';
import RunCypherQuery from '../database/RunCypherQuery';

const PostQuery = async ({
  id,
  logged,
}: {
  id: number;
  logged: number | null;
}) => {
  const query = `MATCH (author:User)-[:CREATED]->(post:Post)-[:IS_LOCATED]->(place:Place)
  WHERE ID(post) = ${id}
  CALL {
      WITH post
      OPTIONAL MATCH (user:User)-[:LIKE]->(post)
      RETURN DISTINCT user AS like
      LIMIT 100
  }
  CALL {
      WITH post
      OPTIONAL MATCH (user:User)-[:CREATED]->(comment:Comment)-[:BELONGS_TO]->(post)
      RETURN DISTINCT comment, user AS commentAuthor
      ORDER BY comment.createdAt DESC
      LIMIT 100
  }
  CALL {
      WITH post
      OPTIONAL MATCH (hashtag:Hashtag)-[:CONTAINS]->(post)
      RETURN DISTINCT hashtag
      LIMIT 100
  }
   
   
  RETURN post{.*, id: ID(post), 
      place: place{.*, id: ID(place)},
      author: author{.*, id: ID(author)}, likes: COLLECT(like{.*, id: ID(like)}),
      hashtags: COLLECT(hashtag{.*, id:ID(hashtag)}),
      comments: COLLECT(DISTINCT comment{.*, id:ID(comment), author: commentAuthor{.*, id: ID(commentAuthor)}})    
  } AS post`;
  console.log(query);
  const result = await RunCypherQuery(query);

  if (result.records[0] === undefined) throw new Error('Post does not exist');
  else
    return {
      ...result.records[0].get('post'),
      url: ParseUrls(result.records[0].get('post').url),
    };
};

export default PostQuery;
