import { ParseUrls } from '../functions';
import RunCypherQuery from '../database/RunCypherQuery';

const PostQuery = async ({
  id,
  logged,
}: {
  id: number;
  logged: number | null;
}) => {
  const query = `WITH ${id} AS inputID
MATCH (author:User)-[:CREATED]->(post:Post)
WHERE ID(post) = inputID
OPTIONAL MATCH (post:Post)<-[:LIKE]-(like:User)
WHERE ID(post) = inputID
OPTIONAL MATCH (post:Post)<-[:CONTAINS]-(hashtag:Hashtag)
WHERE ID(post) = inputID
OPTIONAL MATCH (post:Post)<-[:BELONGS_TO]-(comment:Comment)<-[:CREATED]-(commentAuthor:User)
WHERE ID(post) = inputID
RETURN post{.*, id: ID(post), author: author{.*, id: ID(author)}, likes: COLLECT(DISTINCT like{.*, id: ID(like)}), hashtags: COLLECT(DISTINCT hashtag{.*}), comments: COLLECT(comment{.*, id:ID(comment), author: commentAuthor{.*, id: ID(commentAuthor)}})} AS post`;

  const result = await RunCypherQuery(query);

  if (result.records[0] === undefined) throw new Error('Post does not exist');
  else
    return {
      ...result.records[0].get('post'),
      url: ParseUrls(result.records[0].get('post').url),
    };
};

export default PostQuery;
