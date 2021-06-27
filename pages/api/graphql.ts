import { ApolloServer, makeExecutableSchema } from 'apollo-server-micro';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { join } from 'path';
import DbConnector from '../../src/database/driver';
import { GetUserInfo, UserExists, CreateUser, DeleteUser } from '../../lib';

const loadedFiles = loadFilesSync(join(process.cwd(), '**/*.graphqls'));
const typeDefs = mergeTypeDefs(loadedFiles);

const resolvers = {
  Query: {
    hello: (_parent: any, _args: any, _context: any) => {
      return 'Hello';
    },
    getUserInfo: async (
      _parent: any,
      { input }: any,
      _context: any,
      { operation }: any
    ) => {
      return GetUserInfo(
        input.user,
        operation.selectionSet.selections[0].selectionSet.selections
      );
    },
  },
  Mutation: {
    createUser: async (_parent: any, { input }: any, _context: any) => {
      return CreateUser(input);
    },

    deleteUser: async (_parent: any, { input }: any, _context: any) => {
      return DeleteUser(input);
    },

    follow: async (_parent: any, { input }: any, _context: any) => {
      console.log(input.from);
      if (input.from === input.to) return 'user cannot follow himself';
      if (await !UserExists(input.from)) return 'user from does not exist';
      if (await !UserExists(input.to)) return 'user to does not exist';

      const query = `MATCH
  (a:User),
  (b:User)
WHERE a.username = '${input.from}' AND b.username = '${input.to}'
CREATE (a)-[r:FOLLOW]->(b)`;

      const driver = DbConnector();
      const session = driver.session();

      await session.run(query);
      driver.close();

      return 'relation created';
    },

    unfollow: async (_parent: any, { input }: any, _context: any) => {
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
