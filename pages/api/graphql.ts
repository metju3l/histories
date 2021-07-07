import { ApolloServer, makeExecutableSchema } from 'apollo-server-micro';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { join } from 'path';
import {
  GetUserInfo,
  CreateUser,
  DeleteUser,
  Follow,
  Unfollow,
  CreateCollection,
} from '../../lib';

const loadedFiles = loadFilesSync(join(process.cwd(), '**/*.graphqls'));
const typeDefs = mergeTypeDefs(loadedFiles);

const resolvers = {
  Query: {
    hello: (_parent: any, _args: any, _context: any) => {
      return 'Hello';
    },
    getUserInfo: async (
      _parent: any,
      { input }: { input: { username: string } },
      _context: any,
      { operation }: any
    ) => {
      return GetUserInfo(
        input.username,
        operation.selectionSet.selections[0].selectionSet.selections
      );
    },
  },
  Mutation: {
    createUser: async (_parent: any, { input }: any, _context: any) => {
      return CreateUser(input);
    },

    createCollection: async (_parent: any, { input }: any, _context: any) => {
      return CreateCollection(input);
    },

    deleteUser: async (
      _parent: any,
      { input }: { input: { username: string; password: string } },
      _context: any
    ) => {
      return DeleteUser(input);
    },

    follow: async (
      _parent: any,
      { input }: { input: { from: string; to: string } },
      _context: any
    ) => {
      return Follow(input);
    },

    unfollow: async (
      _parent: any,
      { input }: { input: { from: string; to: string } },
      _context: any
    ) => {
      return Unfollow(input);
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
