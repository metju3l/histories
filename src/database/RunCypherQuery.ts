import { QueryResult, Session } from 'neo4j-driver';
import strip from 'strip-comments';

import DbConnector from './driver';

type RunSingleQueryParams = {
  session: Session;
  query: string;
  params?: {};
};

async function RunSingleQuery({
  session,
  query,
  params,
}: RunSingleQueryParams) {
  // credit to this amazing person from stack owerflow
  // https://stackoverflow.com/a/1981837

  const optimizedQuery = strip(query) // remove all comments
    .replace(/\n/g, ' ') // replace new line with space
    .replace(/  +/g, ' '); // remove all unnecessary spaces

  // run query
  return await session.run(optimizedQuery, params);
}

type RunCypherQueryParams =
  | { query: string; params?: {} }
  | Array<{ query: string; params?: {} }>;

// run a single qurey or an array of queries, returns a array of results
async function RunCypherQuery(args: RunCypherQueryParams) {
  // initialize driver
  const driver = DbConnector();

  // start session
  const session = driver.session();

  // if args is an single object make it array
  const argsArray = Array.isArray(args) ? args : [args];

  const result: QueryResult[] = await Promise.all(
    argsArray.map(async (arg) => RunSingleQuery({ ...arg, session }))
  );

  // close session
  driver.close();

  // return
  return result;
}

export default RunCypherQuery;
