import { GraphQLUpload } from 'graphql-upload';

import {
  IsUsedUsername,
  ValidateComment,
  ValidateCoordinates,
  ValidateDate,
  ValidateDescription,
  ValidateEmail,
  ValidateName,
  ValidatePassword,
  ValidateUsername,
} from '../../shared/validation';
import IsUsedEmail from '../../shared/validation/dbValidation/IsUsedEmail';
import {
  AddPostToCollection,
  CreateCollection,
  CreateComment,
  CreatePost,
  CreateUser,
  Delete,
  DeleteUser,
  EditCollection,
  EditUser,
  Follow,
  Like,
  RemovePostFromCollection,
  Report,
  Unfollow,
  Unlike,
} from '../mutations';
import LastPost from '../mutations/lastPost';
import VerifyToken from '../mutations/VerifyToken';
import {
  CollectionQuery,
  GetPaths,
  GetTagInfo,
  Login,
  SuggestedUsersQuery,
  UserQuery,
} from '../queries';
import FilterPlaces from '../queries/FilterPlaces';
import FilterPlaces1 from '../queries/FilterPlaces1';
import PersonalizedPostsQuery from '../queries/PersonalizedPostsQuery';
import PlaceQuery from '../queries/PlaceQuery';
import PostQuery from '../queries/PostQuery';
import { UploadPhoto } from '../s3/';

type contextType = {
  decoded: { id: number };
  validToken: boolean;
};

export function OnlyLogged(context: contextType) {
  // if user is not logged throw error
  if (!context.validToken) throw new Error('User is not logged');
}

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    // TESTING HELLO QUERY
    hello: () => {
      return 'Hello';
    },

    // PLACE QUERY
    place: async (_parent: undefined, { id }: { id: number }) => {
      return await PlaceQuery({ id });
    },

    personalizedPosts: async (
      _parent: undefined,
      { input }: { input: { skip: number; take: number } },
      context: contextType
    ) => {
      return await PersonalizedPostsQuery({
        ...input,
        logged: context.validToken ? context.decoded.id : null,
      });
    },

    paths: async () => await GetPaths(),

    suggestedUsers: async (
      _parent: undefined,
      _input: undefined,
      context: contextType
    ) => {
      return await SuggestedUsersQuery(
        context.validToken ? context.decoded.id : null
      );
    },

    places: async (
      _parent: undefined,
      {
        input,
      }: {
        input: {
          filter: {
            maxLatitude: number | null;
            minLatitude: number | null;
            maxLongitude: number | null;
            minLongitude: number | null;
            minDate: number | null;
            maxDate: number | null;
            radius: {
              latitude: number;
              longitude: number;
              distance: number;
            } | null;
            tags: string[] | null;
            skip: number | null;
            take: number | null;
          } | null;
        };
      },
      context: contextType
    ) =>
      await FilterPlaces1({
        ...input,
        loggedId: context.validToken ? context.decoded.id : null,
      }),

    // POSTS FILTERED BY COORDINATES
    mapPosts: async (
      _parent: undefined,
      {
        input,
      }: {
        input: {
          maxLatitude: number;
          minLatitude: number;
          maxLongitude: number;
          minLongitude: number;
          minDate: number;
          maxDate: number;
        };
      }
    ) => await FilterPlaces(input),

    // LOGGED USER QUERY
    isLogged: async (
      _parent: undefined,
      _input: undefined,
      context: contextType
    ) =>
      // if user is logged return user data, else return null
      context.validToken ? await UserQuery({ id: context.decoded.id }) : null,

    // POST QUERY
    post: async (
      _parent: undefined,
      { id }: { id: number },
      context: contextType
    ) =>
      await PostQuery({
        id,
        logged: context.decoded === null ? null : context.decoded.id,
      }),

    tag: async (_parent: undefined, { label }: { label: string }) => {
      return GetTagInfo({ label });
    },

    // USER QUERY
    user: async (
      _parent: undefined,
      { input }: { input: { username: string; id: number } },
      context: contextType
    ) =>
      await UserQuery({
        logged: context.validToken ? context.decoded.id : undefined,
        ...input,
      }),

    // COLLECTION QUERY
    collection: async (
      _parent: undefined,
      { id }: { id: number },
      context: contextType
    ) =>
      await CollectionQuery({
        id,
        logged: context.validToken ? context.decoded.id : null,
      }),
  },
  Mutation: {
    login: async (
      _parent: undefined,
      { input }: { input: { username: string; password: string } }
    ) => await Login({ ...input, name: input.username }),

    like: async (
      _parent: undefined,
      { input }: { input: { type: string; id: number } },
      context: contextType
    ) => {
      OnlyLogged(context);
      return await Like({
        logged: context.decoded.id,
        target: input.id,
        type: input.type,
      });
    },
    unlike: async (
      _parent: undefined,
      { id }: { id: number },
      context: contextType
    ) => {
      OnlyLogged(context);
      return await Unlike({
        loggedID: context.decoded.id,
        id,
      });
    },

    addToCollection: async (
      _parent: undefined,
      { input }: { input: { collectionId: number; postId: number } },
      context: contextType
    ) => {
      OnlyLogged(context);
      await AddPostToCollection({
        ...input,
        userId: context.decoded.id,
      });
      return 0;
    },

    removeFromCollection: async (
      _parent: undefined,
      { input }: { input: { collectionId: number; postId: number } },
      context: contextType
    ) => {
      OnlyLogged(context);
      await RemovePostFromCollection({
        ...input,
        userId: context.decoded.id,
      });
      return 0;
    },

    report: async (
      _parent: undefined,
      { id }: { id: number },
      context: contextType
    ) => {
      OnlyLogged(context);
      await Report({ logged: context.decoded.id, target: id });
      return 0;
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
      context: contextType
    ) => {
      OnlyLogged(context);

      const user = await UserQuery({
        id: context.decoded.id,
      });

      if (input.username !== undefined) {
        const validateUsername = ValidateUsername(input.username).error;
        if (validateUsername) throw new Error(validateUsername);
        if (user.username != input.username)
          if (await IsUsedUsername(input.username))
            throw new Error('Username is already used');
      }

      if (input.email !== undefined) {
        const validateEmail = ValidateEmail(input.email).error;
        if (validateEmail) throw new Error(validateEmail);
        if (user.email != input.email)
          if (await IsUsedEmail(input.email))
            throw new Error('Email is already used');
      }
      // check first name
      if (input.firstName !== undefined) {
        const validateFirstName = ValidateName(input.firstName).error;
        if (validateFirstName)
          throw new Error('First name ' + validateFirstName);
      }

      // check last name
      if (input.lastName !== undefined) {
        const validateLastName = ValidateName(input.lastName).error;
        if (validateLastName) throw new Error('Last name ' + validateLastName);
      }

      if (input.bio !== undefined) {
        const validateBio = ValidateDescription(input.bio).error;
        if (validateBio) throw new Error(validateBio);
      }

      return EditUser({ ...input, id: context.decoded.id });
    },

    createComment: async (
      _parent: undefined,
      {
        input: { target, content },
      }: { input: { target: number; content: string } },
      context: contextType
    ) => {
      OnlyLogged(context);

      const validateComment = ValidateComment(content).error;

      if (validateComment) {
        throw new Error(validateComment);
      }

      await CreateComment({
        targetID: target,
        authorID: context.decoded.id,
        content,
      });
      return 0;
    },

    searchUser: async () => {
      // search for username like this
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
          emailSubscription: boolean;
          password: string;
        };
      }
    ) => {
      // check email
      const validateEmail = ValidateEmail(input.email).error;
      if (validateEmail) throw new Error(validateEmail);

      if (await IsUsedEmail(input.email))
        throw new Error('Email is already used');

      // check username
      const validateUsername = ValidateUsername(input.username).error;
      if (validateUsername) throw new Error(validateUsername);

      if (await IsUsedUsername(input.username))
        throw new Error('Username is already used');

      // check first name
      const validateFirstName = ValidateName(input.firstName).error;
      if (validateFirstName) throw new Error('First name ' + validateFirstName);

      // check last name
      const validateLastName = ValidateName(input.lastName).error;
      if (validateLastName) throw new Error('Last name ' + validateLastName);

      // check password
      const validatePassword = ValidatePassword(input.password).error;
      if (validatePassword) throw new Error(validatePassword);

      await CreateUser(input);
      return 0;
    },

    createCollection: async (
      _parent: undefined,
      {
        input,
      }: {
        input: {
          name: string;
          description: string;
          isPrivate: boolean;
        };
      },
      context: contextType
    ) => {
      OnlyLogged(context);
      return CreateCollection({
        ...input,
        preview: '',
        userId: context.decoded.id,
      });
    },

    editCollection: async (
      _parent: undefined,
      {
        input,
      }: {
        input: {
          name: string;
          description: string;
          isPrivate: boolean;
          collectionId: number;
        };
      },
      context: contextType
    ) => {
      OnlyLogged(context);
      return EditCollection({
        ...input,
        preview: '',
        userId: context.decoded.id,
      });
    },

    createPost: async (
      _parent: undefined,
      {
        input,
      }: {
        input: {
          photo: any;
          description: string;
          hashtags: string;
          photoDate: string;
          longitude: number;
          latitude: number;
        };
      },
      context: contextType
    ) => {
      OnlyLogged(context);
      // check coordinates
      const validateCoordinates = ValidateCoordinates([
        input.latitude,
        input.longitude,
      ]).error;
      if (validateCoordinates) throw new Error(validateCoordinates);

      // check description
      const validateDescription = ValidateDescription(input.description).error;
      if (validateDescription) throw new Error(validateDescription);

      // check date
      const validateDate = ValidateDate(Number(input.photoDate)).error;
      if (validateDate) throw new Error(validateDate);

      // if last post / collection was created less than 10 seconds ago
      if (
        new Date().getTime() -
          parseInt(await LastPost({ userID: context.decoded.id })) <
        10000
      )
        throw new Error('you can create post every 10sec');

      if (input.photo.length === 0) throw new Error('No photo');

      const urls: Array<{ url: string; blurhash: string }> = await Promise.all(
        input.photo.map(async (photo: any) => await UploadPhoto(photo))
      );

      if (context.validToken)
        CreatePost({
          ...input,
          userID: context.decoded.id,
          url: urls,
        });
      else throw new Error('User is not logged');

      return 'post created';
    },

    delete: async (
      _parent: undefined,
      { id }: { id: number },
      context: contextType
    ) => {
      OnlyLogged(context);
      return await Delete({ logged: context.decoded.id, id });
    },

    deleteUser: async (
      _parent: undefined,
      { input }: { input: { username: string; password: string } },
      context: contextType
    ) => {
      OnlyLogged(context);
      return DeleteUser(input);
    },

    verifyToken: async (_parent: undefined, { token }: { token: string }) => {
      return await VerifyToken(token);
    },

    follow: async (
      _parent: undefined,
      { userID }: { userID: number },
      context: contextType
    ) => {
      OnlyLogged(context);
      if (context.decoded.id == userID)
        throw new Error('You cannot follow yourself');

      return await Follow(context.decoded.id, userID);
    },

    unfollow: async (
      _parent: undefined,
      { userID }: { userID: number },
      context: contextType
    ) => {
      OnlyLogged(context);
      if (context.decoded.id == userID)
        throw new Error('You cannot unfollow yourself');
      return Unfollow(context.decoded.id, userID);
    },
  },
};

export default resolvers;
