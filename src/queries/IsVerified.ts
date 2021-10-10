import DbConnector from '../database/driver';

const IsVerified = async (id: number) => {
  const query = `
MATCH (user:User)
WHERE ID(user) = ${id}
RETURN user.verified AS verified LIMIT 1`;

  const driver = DbConnector();
  const session = driver.session();
  const result = await session.run(query);
  driver.close();

  return JSON.parse(result.records[0].get('verified'));
};

export default IsVerified;
