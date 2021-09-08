import { ValidateEmail } from '@lib/validation';
import DbConnector from '../database/driver';

const IsUsedEmail = async (email: string): Promise<boolean | string> => {
  if (ValidateEmail(email).error) return ValidateEmail(email).error!;

  const query = `MATCH (user:User)
  WHERE user.email =~ "(?i)${email}"
  RETURN COUNT(user) > 0 AS isUsed`;

  const driver = DbConnector();
  const session = driver.session();
  const response = await session.run(query);
  driver.close();

  return response.records[0].get('isUsed');
};

export default IsUsedEmail;
