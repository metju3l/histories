import { gql } from '@apollo/client';

export default gql`
  scalar Upload

  type Query {
    "Example query"
    hello: String!
    user(input: UserInput!): User!

    "Returns post detail information"
    post(id: Int!): Post!

    suggestedUsers: [User]!
    tag(label: String!): TagInfo
    paths: [Path]

    "Returns info about logged user"
    me: User

    userPosts(input: UserPostsInput!): [Post!]!
    personalizedPosts(input: PersonalizedPostsInput): [PersonalizedPost!]!

    "Returns place detail information"
    place(id: Int!): Place!

    "Returns places with possibility to add filters"
    places(input: PlacesInput): [Place!]!

    "Returns collection detail information"
    collection(id: Int!): Collection!
  }

  type Mutation {
    "Returns JWT"
    login(input: LoginInput!): String!

    deleteUser(input: DeleteUserInput!): String!
    delete(id: Int!): String
    report(id: Int!): String
    like(input: LikeInput!): String
    unlike(id: Int!): String
    follow(userID: Int!): String
    unfollow(userID: Int!): String
    createCollection(input: CreateCollectionInput!): String
    editCollection(input: EditCollectionInput!): String
    updateProfile(input: UpdateProfileInput!): String!
    createPost(input: CreatePostInput!): String!
    searchUser(input: SearchUserInput!): String!
    createUser(input: CreateUserInput!): String!
    verifyToken(token: String!): String!
    createComment(input: CreateCommentInput!): String!
    addToCollection(input: AddToCollectionInput!): String!
    removeFromCollection(input: AddToCollectionInput!): String!
  }

  input Radius {
    latitude: Float
    longitude: Float
    distance: Float
  }

  type PlacesFilter {
    maxLatitude: Float
    minLatitude: Float
    maxLongitude: Float
    minLongitude: Float
    minDate: Float
    maxDate: Float
    radius: Radius
    tags: [String]
    skip: Int
    take: Int
  }

  input PlacesFilter {
    maxLatitude: Float
    minLatitude: Float
    maxLongitude: Float
    minLongitude: Float
    minDate: Float
    maxDate: Float
    radius: Radius
    tags: [String]
    skip: Int
    take: Int
  }

  input PlacesInput {
    filter: PlacesFilter
  }

  input PersonalizedPostsInput {
    skip: Int!
    take: Int!
  }

  type PersonalizedPostAuthor {
    id: Int!
    bio: String
    profileUrl: String!
    firstName: String!
    lastName: String!
    username: String!
    createdAt: Float!
  }

  type PersonalizedPostPlace {
    id: Int!
    postCount: Int!
    likeCount: Int!
    name: String!
    description: String
    preview: String
    latitude: Float!
    longitude: Float!
  }

  type PersonalizedPostComment {
    id: Int!
    content: String
    author: PersonalizedPostAuthor!
    edited: Boolean!
    liked: String
  }

  type PersonalizedPost {
    id: Int!
    description: String
    url: [String]!
    createdAt: Float!
    postDate: Float!
    edited: Boolean!
    nsfw: Boolean!
    public: Boolean!
    author: PersonalizedPostAuthor!
    liked: String
    likeCount: Int!
    commentCount: Int!
    comments: [PersonalizedPostComment]!
    place: PersonalizedPostPlace!
    query: String
  }

  input AddToCollectionInput {
    postId: Int!
    collectionId: Int!
  }

  input CreateCommentInput {
    target: Int!
    content: String!
  }

  type Place {
    id: Int!
    latitude: Float!
    longitude: Float!
    description: String!
    name: String
    preview: [String!]
    icon: String
    posts: [Post]!
    nearbyPlaces: [NearbyPlaces]!
    distance: Float
  }

  type NearbyPlaces {
    id: Int!
    description: String!
    name: String!
    preview: String!
    distance: Float!
  }

  type Post {
    createdAt: Float!
    postDate: Float!
    description: String
    hashtags: [Hashtag]
    url: [String!]!
    id: Int!
    author: UserInfoMinimal!
    likes: [UserInfoMinimal]!
    liked: Boolean!
    comments: [Comment]!
  }

  type Comment {
    id: Int!
    createdAt: Float!
    content: String!
    liked: Boolean!
    author: UserInfoMinimal!
  }

  type Hashtag {
    name: String!
  }

  input LikeInput {
    id: Int!
    type: String!
  }

  input CreatePostInput {
    description: String
    hashtags: String
    photoDate: String!
    latitude: Float!
    longitude: Float!
    photo: [Upload!]!
  }

  input UpdateProfileInput {
    username: String
    email: String
    firstName: String
    lastName: String
    bio: String
    password: String
  }

  input UserPostsInput {
    id: Int!
    offset: Int
  }

  input DeleteUserInput {
    username: String!
    password: String!
  }

  input CreateCollectionInput {
    name: String!
    description: String!
    isPrivate: Boolean!
  }

  input EditCollectionInput {
    name: String!
    description: String!
    isPrivate: Boolean!
    collectionId: Int!
  }

  type Path {
    name: String!
    coordinates: String!
  }

  type User {
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    bio: String
    profile: String!
    verified: String!
    createdAt: Float!
    isFollowing: Boolean!
    followerCount: Int!
    followingCount: Int!
    postCount: Int!
    id: Float!
    following: [UserInfoMinimal]
    followers: [UserInfoMinimal]
    collections: [Collection]
    posts: [Post!]!
  }

  type PostInfoNew {
    id: Float!
    url: [String!]!
    description: String
  }

  type PostID {
    id: Int!
  }

  type UserInfoMinimal {
    id: Float!
    username: String!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Collection {
    id: Float!
    createdAt: Float!
    description: String
    name: String!
    preview: String
    postCount: Int!
    author: UserInfoMinimal!
    posts: [PostInfoNew]!
  }

  type TagInfo {
    label: String!
    numberOfPosts: Int!
    numberOfUniqueUsers: Int!
    oldestPostDate: String!
    newestPostDate: String!
    topPosts: [Post]
    posts: [Post]
  }

  input UserInput {
    username: String
    id: Int
  }

  input SearchUserInput {
    username: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  input CreateUserInput {
    username: String!
    email: String!
    emailSubscription: Boolean!
    firstName: String!
    lastName: String!
    password: String!
  }
`;
