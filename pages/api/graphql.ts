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
import { verify } from 'jsonwebtoken';

const loadedFiles = loadFilesSync(join(process.cwd(), '**/*.graphqls'));
const typeDefs = mergeTypeDefs(loadedFiles);

const resolvers = {
  Query: {
    hello: () => {
      return 'Hello';
    },

    isLogged: async (_parent: undefined, _input: undefined, context: any) => {
      return context.validToken;
    },

    getUserInfo: async (
      _parent: undefined,
      { input }: { input: { username: string } },
      context: any,
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

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: (context) => {
    try {
      const jwt = context.req.headers.authorization.substring(7);
      const host = context.req.headers.host;
      const decoded = verify(jwt, process.env.JWT_SECRET!);
      return { validToken: true, decoded: decoded };
    } catch (err) {
      return { validToken: false, decoded: null };
    }
  },
});

const handler = apolloServer.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
