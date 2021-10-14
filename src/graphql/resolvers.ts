import {
  IsUsedUsername,
  ExistsUser,
  ValidateEmail,
  ValidateUsername,
  ValidateName,
  ValidatePassword,
  FollowsUser,
  ValidateCoordinates,
  ValidateDescription,
  ValidateDate,
} from '../validation';
import {
  CreateCollection,
  CreatePost,
  CreateUser,
  DeletePost,
  DeleteUser,
  EditProfile,
  Follow,
  Like,
  Unfollow,
} from '../mutations';
import {
  GetPaths,
  GetTagInfo,
  Login,
  SuggestedUsersQuery,
  UserQuery,
} from '../queries';
import VerifyToken from '../mutations/VerifyToken';
import FilterPlaces from '../queries/FilterPlaces';
import IsVerified from '../queries/IsVerified';
import PersonalizedPostsQuery from '../queries/PersonalizedPostsQuery';
import PlaceQuery from '../queries/PlaceQuery';
import PostQuery from '../queries/PostQuery';
import IsUsedEmail from '../validation/dbValidation/IsUsedEmail';
import { GraphQLUpload } from 'graphql-upload';
import AWS from 'aws-sdk';
import { uuid } from 'uuidv4';
import sharp from 'sharp';
import streamToPromise from 'stream-to-promise';

type contextType = {
  decoded: { id: number };
  validToken: boolean;
};

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    hello: () => {
      return 'Hello';
    },
    place: async (_parent: undefined, { id }: { id: number }) => {
      return await PlaceQuery({ id });
    },

    personalizedPosts: async (
      _parent: undefined,
      _input: undefined,
      context: any
    ) => {
      return await PersonalizedPostsQuery(
        context.validToken ? context.decoded.id : null
      );
    },

    paths: async () => {
      return await GetPaths();
    },

    suggestedUsers: async (
      _parent: undefined,
      _input: undefined,
      context: any
    ) => {
      return await SuggestedUsersQuery(
        context.validToken ? context.decoded.id : null
      );
    },

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
    ) => {
      return await FilterPlaces(input);
    },

    checkIfLogged: async (
      _parent: undefined,
      _input: undefined,
      context: any
    ) => {
      // return user data
      if (context.validToken) {
        return {
          logged: true,
          verified: await IsVerified(context.decoded.id),
        };
      } else return { logged: false, verified: undefined };
    },

    isLogged: async (
      _parent: undefined,
      _input: undefined,
      context: contextType
    ) => {
      // return user data
      if (context.validToken)
        return await UserQuery({ id: context.decoded.id });
      else return null;
    },

    post: async (
      _parent: undefined,
      { id }: { id: number },
      context: contextType
    ) => {
      return await PostQuery({
        id,
        logged: context.decoded === null ? null : context.decoded.id,
      });
    },

    tag: async (_parent: undefined, { label }: { label: string }) => {
      return GetTagInfo({ label });
    },

    user: async (
      _parent: undefined,
      { input }: { input: { username: string; id: number } },
      context: contextType
    ) => {
      return await UserQuery({
        logged: context.validToken ? context.decoded.id : undefined,
        ...input,
      });
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
      context: contextType
    ) => {
      if (!context.validToken) throw new Error('User is not logged in');

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

      return EditProfile({ ...input, id: context.decoded.id });
    },

    searchUser: async () => {
      // search for username like this
    },

    login: async (
      _parent: undefined,
      { input }: { input: { username: string; password: string } }
    ) => {
      // check username
      if (
        ValidateUsername(input.username).error &&
        ValidateEmail(input.username).error
      )
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
          photo: any;
          description: string;
          hashtags: string;
          photoDate: string;
          longitude: number;
          latitude: number;
        };
      },
      context: any
    ) => {
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

      const { createReadStream, filename, mimetype, encoding } =
        await input.photo;
      if (!mimetype.startsWith('image/'))
        throw new Error('file is not a image');

      const uniqueFileName = `${new Date().getTime()}-${uuid().substring(
        0,
        8
      )}.jpg`;

      const stream = await createReadStream();
      const buffer = await streamToPromise(stream);
      const image = await sharp(buffer)
        .resize(800, undefined, { withoutEnlargement: true })
        .jpeg()
        .toBuffer();

      if (!process.env.AWS_BUCKET) throw new Error('S3 bucket is not defined');
      if (!process.env.S3_ACCESS_KEY)
        throw new Error('S3 access key is not defined');
      if (!process.env.S3_SECRET_ACCESS_KEY)
        throw new Error('S3 secret access key is not defined');

      const params = {
        Bucket: 'histories-bucket',
        Key: uniqueFileName,
        Body: image,
        ACL: 'public-read',
      };

      const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      });

      const promise = await s3
        .upload(params, (error: any, data: any) => {
          if (error) {
            console.error(error);
          } else {
            console.log(data);
          }
        })
        .promise();

      if (context.validToken)
        CreatePost({
          ...input,
          userID: context.decoded.id,
          url: promise.Location,
        });
      else throw new Error('User is not logged');

      return 'post created';
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

    verifyToken: async (_parent: undefined, { token }: { token: string }) => {
      return await VerifyToken(token);
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

export default resolvers;
