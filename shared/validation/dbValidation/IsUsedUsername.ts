import DbConnector from '../../../src/database/driver';

const UserExists = async (username: string): Promise<boolean> => {
  // cypher query
  const query = `MATCH (user:User)
  WHERE user.username =~ "(?i)${username}"
  RETURN COUNT(user) > 0 AS isUsed`;

  // run query
  const driver = DbConnector();
  const session = driver.session();
  const response = await session.run(query);
  driver.close();

  // otherwise return boolean
  return response.records[0].get('isUsed');
};

export default UserExists;
