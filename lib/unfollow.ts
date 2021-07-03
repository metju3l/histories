import DbConnector from './database/driver';
import UserExists from './validator/userExists';

const Unfollow = async (input: any) => {
  console.log(input.from);
  if (input.from === input.to) return 'user cannot follow himself';
  if (await !UserExists(input.from)) return 'user from does not exist';
  if (await !UserExists(input.to)) return 'user to does not exist';

  const query = `MATCH (a:User {username: '${input.from}'})-[r:FOLLOW]->(b:User {username: '${input.to}'}) DELETE r`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'relation deleted';
};

export default Unfollow;
