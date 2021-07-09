import DbConnector from '../database/driver';
import UserExists from '../validator/userExists';
import { CheckCredentials } from '../validator';
import { hash } from 'bcryptjs';

const CreateUser = async (input: {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const { username, firstName, lastName, email, password } = input;

  if (CheckCredentials(input) !== '') return CheckCredentials(input);

  if (await UserExists(username)) return 'username is already used';
  else if (await UserExists(email)) return 'email is already used';
  else {
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

    return (await UserExists(username)) ? 'user created' : 'failed';
  }
};

export default CreateUser;
