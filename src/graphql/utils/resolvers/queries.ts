import {
  PersonalizedPostsInput,
  PlacesInput,
} from '../../../../.cache/__types__';
import {
  CollectionQuery,
  FilterPlacesQuery,
  MeQuery,
  PersonalizedPostsQuery,
  PlaceQuery,
  PostQuery,
  PostsQuery,
  SuggestedUsersQuery,
  UserQuery,
} from '../../../graphql/resolvers';
import { contextType } from './resolvers';

const queries = {
  // TESTING HELLO QUERY
  hello: () => {
    return 'Hello';
  },

  // PLACE
  place: async (_parent: undefined, { id }: { id: number }) => {
    return await PlaceQuery({ id });
  },

  // PLACES
  places: async (
    _parent: undefined,
    {
      input,
    }: {
      input: PlacesInput;
    },
    context: contextType
  ) =>
    await FilterPlacesQuery({
      ...input,
      loggedId: context.validToken ? context.decoded.id : null,
    }),

  // POST
  post: async (
    _parent: undefined,
    { id }: { id: number },
    context: contextType
  ) =>
    await PostQuery({
      id,
      logged: context.decoded === null ? null : context.decoded.id,
    }),

  // POSTS
  posts: async (
    _parent: undefined,
    {
      input,
    }: {
      input: {
        filter: {
          placeId?: number;
          authorId?: number;
          authorUsername?: string;
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
    await PostsQuery({
      ...input,
      loggedId: context.validToken ? context.decoded.id : null,
    }),

  // PERSONALIZED POSTS
  personalizedPosts: async (
    _parent: undefined,
    { input }: { input: PersonalizedPostsInput },
    context: contextType
  ) =>
    await PersonalizedPostsQuery({
      ...input,
      logged: context.validToken ? context.decoded.id : null,
    }),

  suggestedUsers: async (
    _parent: undefined,
    _input: undefined,
    context: contextType
  ) => {
    return await SuggestedUsersQuery(
      context.validToken ? context.decoded.id : null
    );
  },

  // LOGGED USER
  me: async (_parent: undefined, _input: undefined, context: contextType) =>
    // if user is logged return user data, else return null
    context.validToken ? await MeQuery({ id: context.decoded.id }) : null,

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
};

export default queries;
