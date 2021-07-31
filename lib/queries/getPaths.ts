import DbConnector from '../database/driver';

const GetPaths = async (): Promise<[name: string, coordinates: string]> => {
  const query = 'MATCH (n:Path) RETURN n, ID(n)';

  const driver = DbConnector();
  const session = driver.session();

  const paths = await session.run(query);

  driver.close();

  // @ts-ignore
  return paths.records.map((path) => {
    return path.get('n').properties;
  });
};

export default GetPaths;
