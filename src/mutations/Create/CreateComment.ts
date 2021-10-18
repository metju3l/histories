import RunCypherQuery from '../../database/RunCypherQuery';

const CreateComment = async ({
  authorID,
  targetID,
  content,
}: {
  authorID: number;
  targetID: number;
  content: string;
}) => {
  const query = `MATCH (target),(author:User) 
WHERE ID(target) = ${targetID} AND ID(author) = ${authorID}
AND labels(target) in [["Post"],["Comment"]]
CREATE (author)-[:CREATED]->(comment:Comment{createdAt:${new Date().getTime()},content:"${content}"})-[:BELONGS_TO]->(target)`;

  await RunCypherQuery(query);

  return 'success';
};

export default CreateComment;
