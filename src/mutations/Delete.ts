import { ParseUrls } from '../functions';
import { DeleteFile } from '../s3';
import DbConnector from '../database/driver';
import RunCypherQuery from '../database/RunCypherQuery';

const Delete = async ({
  logged,
  id,
}: {
  logged: number;
  id: number;
}): Promise<string> => {
  const query = `MATCH (user:User)-[:CREATED]->(target)
WHERE ID(user) = ${logged} AND ID(target) = ${id}
AND labels(target) in [["Post"],["Comment"],["Collection"]]
DETACH DELETE target`;

  const labels = await RunCypherQuery(`MATCH (user:User)-[:CREATED]->(target)
WHERE ID(user) = ${logged} AND ID(target) = ${id}
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
      ParseUrls(fileAddress.records[0].get('urls')).map((url: string) =>
        DeleteFile(url)
      )
    );
  }
  await session.run(query);

  driver.close();

  return 'post deleted';
};

export default Delete;
