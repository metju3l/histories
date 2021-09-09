import { ApolloServer } from 'apollo-server-micro';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { join } from 'path';
import {
  UserQuery,
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
  GetTagInfo,
} from '../../lib';
import { verify } from 'jsonwebtoken';
import GetPostInfo from '@lib/queries/getPostInfo';
import {
  IsUsedUsername,
  ExistsUser,
  ValidateEmail,
  ValidateUsername,
  ValidateName,
  ValidatePassword,
  FollowsUser,
} from '@lib/validation';
import IsUsedEmail from '@lib/validation/IsUsedEmail';
import IsString from '@lib/functions/IsString';

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

    interClipCode: async (
      _parent: undefined,
      { id }: { id: number },
      context: any
    ) => {
      // check if user exists
      const userExists = ExistsUser(id);
      if (!userExists) throw new Error("User doesn't exist");
      // get username
      const username = (await UserQuery(null, undefined, id, undefined))
        .username;
      // create url
      const url = `http://localhost:3000/${username}`;
      // api call
      return await fetch(`https://interclip.app/api/set?url=${url}`)
        .then((response) => response.json())
        .then((data) => {
          return data.result;
        })
        .catch((error) => {
          throw new Error(error);
        });
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

    tag: async (
      _parent: undefined,
      { label }: { label: string },
      context: any
    ) => {
      return GetTagInfo({ label });
    },

    user: async (
      _parent: undefined,
      { input: { username, id } }: { input: { username: string; id: number } },
      context: any,
      { operation }: any
    ) => {
      console.log(context.decoded);

      // if username and id are undefined
      if (username === undefined && id === undefined)
        throw new Error('Username or id required');

      // if ID is filled in
      if (id) {
        // check if user exists
        const userExists = ExistsUser(id);
        if (!userExists) throw new Error("User doesn't exist");
      }
      // if USERNAME is filled in
      else if (username) {
        // checks if username exists and if username is valid
        const isUsedUsername = await IsUsedUsername(username);
        if (typeof isUsedUsername === 'string') throw new Error(isUsedUsername);
        // if user doesn't exist
        else if (!isUsedUsername) throw new Error("User doesn't exist");
      }

      // return user data
      return UserQuery(
        context.validToken ? context.decoded.username : null,
        username,
        id,
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
      // check username
      if (ValidateUsername(input.username).error)
        throw new Error('Wrong credentials');

      if (!(await IsUsedUsername(input.username)))
        throw new Error('Wrong credentials');

      // check password
      if (ValidatePassword(input.password).error)
        throw new Error('Wrong credentials');

      // if credentials are wrong returns null
      const login = await Login(input);
      if (login !== null) return login;
      else throw new Error('Wrong credentials');
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
      // check email
      if (ValidateEmail(input.email).error)
        throw new Error(ValidateEmail(input.email).error!);

      if (await IsUsedEmail(input.email))
        throw new Error('Email is already used');

      // check username
      if (ValidateUsername(input.username).error)
        throw new Error(ValidateUsername(input.username).error!);

      if (await IsUsedUsername(input.username))
        throw new Error('Username is already used');

      // check first name
      if (ValidateName(input.firstName).error)
        throw new Error('First name ' + ValidateName(input.firstName).error!);

      // check first name
      if (ValidateName(input.lastName).error)
        throw new Error('Last name ' + ValidateName(input.lastName).error!);

      // check password
      if (ValidatePassword(input.password).error)
        throw new Error(ValidatePassword(input.password).error!);

      return await CreateUser(input);
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
      { id }: { id: number },
      context: any
    ) => {
      return context.validToken
        ? DeletePost({ logged: context.decoded.username, id })
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
      // if user wants to follow himself
      if (context.decoded.id == userID)
        throw new Error('You cannot follow yourself');

      // if logged user does not exist
      if (!(await ExistsUser(context.decoded.id)))
        throw new Error('Logged user is not valid');

      // if user to follow does not exist
      if (!(await ExistsUser(userID))) throw new Error('User does not exist');

      // check if there already is relation
      if (await FollowsUser(context.decoded.id, userID))
        throw new Error('User is already followed');

      return await Follow(context.decoded.id, userID);
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
      // get JWT
      const jwt = context.req.headers.authorization.substring(7);
      // verify JWT
      const decoded = verify(jwt, process.env.JWT_SECRET!);
      return { validToken: true, decoded: decoded };
      // if JWT is nto valid
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
