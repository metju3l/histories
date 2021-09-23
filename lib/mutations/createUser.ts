import DbConnector from '../database/driver';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const CreateUser = async (input: {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<string> => {
  const { username, firstName, lastName, email, password } = input;

  const hashedPassword = await hash(
    password,
    parseInt(process.env.HASH_SALT || '10')
  );

  const query = `CREATE
    (n:User {
      username : "${username}",
      firstName: "${firstName}",
      lastName: "${lastName}",
      email: "${email}",
      password: "${hashedPassword}",
      createdAt: "${new Date().getTime()}",
      verified: "false",
      authorizationToken: "${new Date().getTime()}-${uuidv4()}"
    })`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'success';
};

export default CreateUser;
