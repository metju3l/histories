import DbConnector from '../../database/driver';

const DeleteUnauthorized = async (): Promise<Boolean> => {
  const query = `
  MATCH (user:User) 
  WHERE user.verified = false AND user.createdAt < ${
    new Date().getTime() - 1000 * 60 * 60 * 24 * 3
  } DELETE user`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();
  return true;
};

export default DeleteUnauthorized;
