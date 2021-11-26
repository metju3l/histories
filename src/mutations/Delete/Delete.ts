import DbConnector from '../../database/driver';
import RunCypherQuery from '../../database/RunCypherQuery';
import { DeleteFile } from '../../s3';

const Delete = async ({
  logged,
  id,
}: {
  logged: number;
  id: number;
}): Promise<void> => {
  const query = `MATCH (user:User), (target)
  WHERE ID(user) = ${logged} AND ID(target) = ${id}
  AND ((user)-[:CREATED]->(target) OR user :Admin)
  AND labels(target) in [["Post"],["Comment"],["Collection"]]
  OPTIONAL MATCH (comment:Comment)-[:BELONGS_TO]->(target)
  WHERE ID(user) = ${logged} AND ID(target) = ${id}
  AND ((user)-[:CREATED]->(target) OR user :Admin)
  AND labels(target) in [["Post"],["Comment"],["Collection"]]
  DETACH DELETE comment, target`;

  const labels = await RunCypherQuery(`MATCH (user:User), (target)
WHERE ID(user) = ${logged} AND ID(target) = ${id}
AND ((user)-[:CREATED]->(target) OR user :Admin)
AND labels(target) in [["Post"],["Comment"],["Collection"]]
RETURN labels(target) AS labels`);

  const driver = DbConnector();
  const session = driver.session();

  if (labels.records[0].get('labels')[0] === 'Post') {
    const fileAddress =
      await session.run(`MATCH (user:User)-[:CREATED]->(post:Post)
WHERE ID(user) = ${logged} AND ID(post) = ${id}
RETURN post.url as urls`);

    await Promise.all(
      fileAddress.records[0].get('urls').map((url: string) => DeleteFile(url))
    );
  }
  await session.run(query);

  driver.close();
};

export default Delete;
