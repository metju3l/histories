import DbConnector from '../database/driver';

const LastPost = async ({ userID }: { userID: any }): Promise<any> => {
  const driver = DbConnector();
  const session = driver.session();
  const query = `MATCH (user:User)-[:CREATED]->(object)
    WHERE ID(user) = ${userID}
    RETURN object.createdAt ORDER BY object.createdAt DESC
    LIMIT 1`;

  const output = await session.run(query);

  driver.close();

  return output.records[0] ? output.records[0].get('object.createdAt') : null;
};

export default LastPost;
