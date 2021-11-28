import strip from 'strip-comments';

import DbConnector from './driver';

const RunCypherQuery = async (query: string, params?: {}) => {
  // credit to this amazing person from stack owerflow
  // https://stackoverflow.com/a/1981837

  const optimizedQuery = strip(query) // remove all comments
    .replace(/\n/g, ' ') // replace new line with space
    .replace(/  +/g, ' '); // remove all unnecessary spaces

  // initialize driver
  const driver = DbConnector();

  // start session
  const session = driver.session();

  // run query
  const result = await session.run(optimizedQuery, params);

  // close session
  driver.close();

  return result;
};

export default RunCypherQuery;
