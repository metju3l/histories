import { ValidateVerificationToken } from '../validation';
import DbConnector from '../database/driver';

const CreateCollection = async (token: string): Promise<string> => {
  const validateToken = ValidateVerificationToken(token).error;
  if (validateToken !== null) throw new Error(validateToken);

  const query = `
  MATCH (user:User {authorizationToken: "${token}"}) 
  SET user.authorizationToken = NULL,
      user.verified = true`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'success';
};

export default CreateCollection;
