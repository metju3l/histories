import RunCypherQuery from '../../../database/RunCypherQuery';

const CreateComment = async ({
  authorID,
  targetID,
  content,
}: {
  authorID: number;
  targetID: number;
  content: string;
}): Promise<void> => {
  const query = `
  MATCH (target),(author:User)
  WHERE ID(target) = $targetId
    AND ID(author) = $authorId
    AND (target:Post OR target:Comment)
  CREATE (author)-[:CREATED]->(:Comment { createdAt:$createdAt,edited:false,content:$content })-[:BELONGS_TO]->(target)`;

  await RunCypherQuery({
    query,
    params: {
      targetId: targetID,
      createdAt: new Date().getTime(),
      content,
      authorId: authorID,
    },
  });
};

export default CreateComment;
