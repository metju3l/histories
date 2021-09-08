import DbConnector from '../database/driver';
import { UserExists } from '../validation';

const CreateCollection = async ({
  username,
  collectionName,
  description,
}: {
  username: string;
  collectionName: string;
  description: string;
}): Promise<string> => {
  const query = `MATCH 
  (author:User)
    WHERE author.username =~ "(?i)${username}"
    CREATE (collection:Collection {
    collectionName: "${collectionName}",
    description: "${description}",
    createdAt: "${new Date().getTime()}"
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
