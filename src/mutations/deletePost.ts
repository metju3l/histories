import { ParseUrls } from '../functions';
import { DeleteFile } from '../s3';
import DbConnector from '../database/driver';

const DeletePost = async ({
  logged,
  id,
}: {
  logged: string;
  id: number;
}): Promise<string> => {
  const query = `MATCH (user:User)-[:CREATED]->(post:Post)
  WHERE user.username = "${logged}" AND ID(post) = ${id}
  DETACH DELETE post`;

  const driver = DbConnector();
  const session = driver.session();

  const fileAddress =
    await session.run(`MATCH (user:User)-[:CREATED]->(post:Post)
 WHERE user.username = "${logged}" AND ID(post) = ${id}
 RETURN post.url as urls`);
  await session.run(query);
  driver.close();

  await Promise.all(
    ParseUrls(fileAddress.records[0].get('urls')).map((url: string) =>
      DeleteFile(url)
    )
  );

  return 'post deleted';
};

export default DeletePost;
