import DbConnector from '../database/driver';
import { CheckCredentials, UserExists } from '../validator/';

const CreateCollection = async ({
  username,
  collectionName,
}: {
  username: string;
  collectionName: string;
}) => {
  if (CheckCredentials({ username: username }) !== '')
    return CheckCredentials({ username: username });
  if (CheckCredentials({ username: collectionName }) !== '')
    return CheckCredentials({ username: collectionName });

  const query = `MATCH 
  (author:User)
    WHERE author.username =~ "(?i)${username}"
    CREATE (collection:Collection {
    collectionName: "${collectionName}",
    createdAt: ${new Date().getTime()}
    })
    CREATE (author)-[r:CREATED]->(collection)
  `;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return (await UserExists(username)) ? 'collection created' : 'failed';
};

export default CreateCollection;
