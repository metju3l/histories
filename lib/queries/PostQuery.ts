import RunCypherQuery from '@lib/database/RunCypherQuery';

const PostQuery = async ({
  id,
  logged,
}: {
  id: number;
  logged: number | null;
}) => {
  const query = `
MATCH (author:User)-[:CREATED]->(post:Post)
WHERE ID(post) = ${id}
OPTIONAL MATCH (post:Post)<-[:LIKE]-(like:User)
WHERE ID(post) = ${id}
OPTIONAL MATCH (post:Post)<-[:CONTAINS]-(hashtag:Hashtag)
WHERE ID(post) = ${id}
RETURN post{.*, id: ID(post), author: author{.*, id: ID(author)}, likes: COLLECT(DISTINCT like{.*, id: ID(like)}), hashtags: COLLECT(DISTINCT hashtag{.*})} AS post`;

  const result = await RunCypherQuery(query);

  if (result.records[0] === undefined) throw new Error('Post does not exist');
  else {
    console.log(result.records[0].get('post'));
    return result.records[0].get('post');
  }
};

export default PostQuery;
