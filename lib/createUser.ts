import DbConnector from './database/driver';
import UserExists from './validator/userExists';
import { Neo4jGraphQL } from '@neo4j/graphql';
import { CheckCredentials } from './validator';
// eslint-disable-next-line
const bcrypt = require('bcrypt');

const CreateUser = async (input: any) => {
  const credentialsCheck = CheckCredentials(input);
  if (credentialsCheck !== '') return credentialsCheck;

  if (await UserExists(input.username)) return 'username is already used';
  else if (await UserExists(input.email)) return 'email is already used';
  else {
    const hashedPassword = await bcrypt.hash(
      input.password,
      parseInt(process.env.HASH_SALT || '10')
    );

    const query = `Create (n:User {username : "${
      input.username
    }", first_name:"${input.first_name}",last_name:"${
      input.last_name
    }", email:"${
      input.email
    }", password:"${hashedPassword}", authenticated:"false", created_at:"${new Date().getTime()}"} )`;

    const driver = DbConnector();
    const session = driver.session();

    await session.run(query);
    driver.close();

    if (await UserExists(input.username)) return 'user created';
    return 'failed';
  }
};

export default CreateUser;
