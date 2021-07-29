import DbConnector from '../database/driver';

const GetPaths = async (): Promise<any> => {
  const query = 'MATCH (n:Path) RETURN n, ID(n)';

  const driver = DbConnector();
  const session = driver.session();

  const paths = await session.run(query);

  driver.close();
  return paths.records[0].get('n').properties;
};

export default GetPaths;
