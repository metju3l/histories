import DbConnector from '../database/driver';

const ExistsUser = async (id: number): Promise<boolean> => {
  const query = `MATCH (user:User)
  WHERE ID(user) = ${id}
  RETURN COUNT(user) > 0 AS userExists`;

  const driver = DbConnector();
  const session = driver.session();
  const response = await session.run(query);
  driver.close();

  return response.records[0].get('userExists');
};

export default ExistsUser;
