import DbConnector from '../database/driver';

const Follow = async (logged: number, userID: number): Promise<string> => {
  const query = `MATCH (a:User), (b:User)
  WHERE ID(a) = ${logged} AND ID(b) = ${userID}
  CREATE (a)-[r:FOLLOW {createdAt: ${new Date().getTime()}}]->(b)`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'success';
};

export default Follow;
