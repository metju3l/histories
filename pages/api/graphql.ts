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
  Login,
} from '../../lib';

const loadedFiles = loadFilesSync(join(process.cwd(), '**/*.graphqls'));
const typeDefs = mergeTypeDefs(loadedFiles);

const resolvers = {
  Query: {
    hello: () => {
      return 'Hello';
    },

    getUserInfo: async (
      _parent: undefined,
      { input }: { input: { username: string } },
      _context: undefined,
      { operation }: any
    ) => {
      return GetUserInfo(
        input.username,
        operation.selectionSet.selections[0].selectionSet.selections
      );
    },
  },
  Mutation: {
    searchUser: async () => {
      // search for username like this
    },

    login: async (
      _parent: undefined,
      { input }: { input: { username: string; password: string } }
    ) => {
      return Login(input);
    },

    createUser: async (
      _parent: undefined,
      {
        input,
      }: {
        input: {
          username: string;
          firstName: string;
          lastName: string;
          email: string;
          password: string;
        };
      }
    ) => {
      return CreateUser(input);
    },

    createCollection: async (
      _parent: undefined,
      {
        input,
      }: {
        input: {
          username: string;
          collectionName: string;
          description: string;
        };
      }
    ) => {
      return CreateCollection(input);
    },

    deleteUser: async (
      _parent: undefined,
      { input }: { input: { username: string; password: string } }
    ) => {
      return DeleteUser(input);
    },

    follow: async (
      _parent: undefined,
      { input }: { input: { from: string; to: string } }
    ) => {
      return Follow(input);
    },

    unfollow: async (
      _parent: undefined,
      { input }: { input: { from: string; to: string } }
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
