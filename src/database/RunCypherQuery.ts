import DbConnector from './driver';

const RunCypherQuery = async (query: string) => {
  // initialize driver
  const driver = DbConnector();

  // start session
  const session = driver.session();

  // run query
  const result = await session.run(query);

  // close session
  driver.close();

  return result;
};

export default RunCypherQuery;
