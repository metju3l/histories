import DbConnector from '../database/driver';

const DeleteUnauthorized = async (): Promise<Boolean> => {
  const query = `
MATCH (user:User {verified: false}) 
WHERE user.createdAt < ${new Date().getTime() - 1000 * 60 * 60 * 72}
DELETE user`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();
  return true;
};

export default DeleteUnauthorized;
