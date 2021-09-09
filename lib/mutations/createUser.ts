import DbConnector from '../database/driver';
import { UserExists } from '../validation';
import { hash } from 'bcryptjs';

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
      authenticated: "false",
      createdAt: "${new Date().getTime()}"
    })`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'success';
};

export default CreateUser;
