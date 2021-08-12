import { ApolloServer } from 'apollo-server-micro';
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
  GetPaths,
  EditProfile,
  CreatePost,
  DeletePost,
  Like,
} from '../../lib';
import { verify } from 'jsonwebtoken';
import GetPostInfo from '@lib/queries/getPostInfo';

const loadedFiles = loadFilesSync(join(process.cwd(), '**/*.graphqls'));
const typeDefs = mergeTypeDefs(loadedFiles);

const resolvers = {
  Query: {
    hello: () => {
      return 'Hello';
    },

    paths: () => {
      return GetPaths();
    },

    isLogged: async (_parent: undefined, _input: undefined, context: any) => {
      return {
        isLogged: context.validToken,
        userID: context.validToken ? context.decoded.username : '',
      };
    },

    post: async (_parent: undefined, { id }: { id: number }, context: any) => {
      return GetPostInfo({
        id,
        logged: context.decoded === null ? null : context.decoded.username,
      });
    },

    getUserInfo: async (
      _parent: undefined,
      { input }: { input: { username: string } },
      context: any,
      { operation }: any
    ) => {
      return GetUserInfo(
        context.validToken ? context.decoded.username : null,
        input.username,
        operation.selectionSet.selections[0].selectionSet.selections
      );
    },
  },
  Mutation: {
    like: async (
      _parent: undefined,
      { input }: { input: { id: number; type: string; to: string } },
      context: any
    ) => {
      return Like({ ...input, logged: context.decoded.username });
    },

    updateProfile: async (
      _parent: undefined,
      {
        input,
      }: {
        input: {
          username: string | undefined;
          bio: string | undefined;
          firstName: string | undefined;
          lastName: string | undefined;
          email: string | undefined;
          password: string | undefined;
        };
      },
      context: any
    ) => {
      EditProfile({ ...input, logged: context.decoded.username });
      return 'idk';
    },

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

    createPost: async (
      _parent: undefined,
      {
        input,
      }: {
        input: {
          description: string;
          hashtags: string;
          photoDate: string;
          longitude: string;
          latitude: string;
        };
      },
      context: any
    ) => {
      return context.validToken
        ? CreatePost({ ...input, userID: context.decoded.username })
        : null;
    },

    deletePost: async (
      _parent: undefined,
      { postID }: { postID: number },
      context: any
    ) => {
      return context.validToken
        ? DeletePost({ logged: context.decoded.username, postID: postID })
        : null;
    },

    deleteUser: async (
      _parent: undefined,
      { input }: { input: { username: string; password: string } }
    ) => {
      return DeleteUser(input);
    },

    follow: async (
      _parent: undefined,
      { userID }: { userID: number },
      context: any
    ) => {
      return Follow(context.decoded.username, userID);
    },

    unfollow: async (
      _parent: undefined,
      { userID }: { userID: number },
      context: any
    ) => {
      return Unfollow(context.decoded.username, userID);
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: (context) => {
    try {
      const jwt = context.req.headers.authorization.substring(7);
      // const host = context.req.headers.host;
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
