import DbConnector from '../database/driver';

const GetPostInfo = async ({
  id,
  logged,
}: {
  id: number;
  logged: string | null;
}) => {
  const query = `MATCH (post:Post) WHERE ID(post) = ${id} RETURN post`;

  const driver = DbConnector();
  const session = driver.session();

  const queryResult = await session.run(query);
  driver.close();
  console.log(queryResult.records[0].get('post').properties);
  return { ...queryResult.records[0].get('post').properties, postID: id };
};

export default GetPostInfo;
