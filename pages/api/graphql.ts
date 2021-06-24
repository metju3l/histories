import ApollerServer, {
  gql,
  ApolloServer,
  makeExecutableSchema,
} from 'apollo-server-micro';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { join } from 'path';
import neo4j from 'neo4j-driver';
import DbConnector from '../../src/database/driver';

const loadedFiles = loadFilesSync(join(process.cwd(), '**/*.graphqls'));
const typeDefs = mergeTypeDefs(loadedFiles);

const resolvers = {
  Query: {
    // @ts-ignore
    hello: (_parent, _args, _context) => {
      return 'Hello';
    },
    // @ts-ignore
    getUserInfo: async (_parent, { input }, _context) => {
      const query = `MATCH (n:User) WHERE n.username = "${input.username}" RETURN n`;

      const driver = DbConnector();
      const session = driver.session();

      const result = await session.run(query);

      driver.close();

      return result.records[0] === undefined
        ? null
        : result.records[0].get('n').properties;
    },
  },
  Mutation: {
    // @ts-ignore
    createUser: async (_parent, { input }, _context) => {
      const query = `MATCH (n:User) WHERE n.username = "${input.username}" RETURN n`;

      const driver = DbConnector();
      const session = driver.session();

      await session.run(query);
      driver.close();

      return 'done';
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({
  schema,
});

const handler = apolloServer.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
