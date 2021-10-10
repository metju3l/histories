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

  await session.run(query);
  driver.close();

  return 'post deleted';
};

export default DeletePost;
