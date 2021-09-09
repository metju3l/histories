import DbConnector from '../database/driver';

const FollowsUser = async (logged: number, id: number): Promise<boolean> => {
  const query = `MATCH (logged:User)-[r:FOLLOW]->(user:User)
    WHERE ID(logged) = ${logged} AND ID(user) = ${id}
    RETURN COUNT(r) > 0 AS follows`;

  const driver = DbConnector();
  const session = driver.session();
  const response = await session.run(query);
  driver.close();

  return response.records[0].get('follows');
};

export default FollowsUser;
