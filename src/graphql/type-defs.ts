import { gql } from '@apollo/client';

export default gql`
  type Query {
    hello: String!
    user(input: UserInput!): User!
    post(id: Int!): Post!
    mapPosts(input: MapPostsInput!): [MapPost]!
    suggestedUsers: [User]!
    tag(label: String!): TagInfo
    paths: [Path]
    isLogged: UserInfoMinimal
    userPosts(input: UserPostsInput!): [Post]
    personalizedPosts: [PostID]!
    checkIfLogged: CheckIfLoggedInfo!
    place(id: Int!): PlaceInfo
  }

  type Mutation {
    deleteUser(input: DeleteUserInput!): String!
    deletePost(id: Int!): String!
    like(input: LikeInput!): String!
    unlike(id: Int!): String!
    follow(userID: Int!): String!
    unfollow(userID: Int!): String!
    createCollection(input: CreateCollectionInput!): String!
    updateProfile(input: UpdateProfileInput!): String!
    createPost(input: CreatePostInput!): String!
    login(input: LoginInput!): String!
    searchUser(input: SearchUserInput!): String!
    createUser(input: CreateUserInput!): String!
    verifyToken(token: String!): String!
  }

  type PlaceInfo {
    id: Int!
    latitude: Float!
    longitude: Float!
    posts: [PostID]
  }

  type CheckIfLoggedInfo {
    logged: Boolean!
    verified: Boolean
  }

  input MapPostsInput {
    minLatitude: Float!
    maxLatitude: Float!
    minLongitude: Float!
    maxLongitude: Float!
    minDate: Float
    maxDate: Float
  }

  type MapPost {
    id: Int!
    latitude: Float!
    longitude: Float!
    posts: [Post]!
  }

  type Post {
    createdAt: Float!
    postDate: Float!
    description: String
    hashtags: [Hashtag]
    url: String!
    id: Int!
    author: UserInfoMinimal!
    likes: [UserInfoMinimal]!
    liked: Boolean!
  }

  type Hashtag {
    name: String!
  }

  input LikeInput {
    id: Int!
    type: String!
    to: String!
  }

  input CreatePostInput {
    description: String
    hashtags: String
    photoDate: String!
    latitude: Float!
    longitude: Float!
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
    collectionName: String!
    description: String
  }

  type IsLoggedInfo {
    isLogged: Boolean!
    userID: String
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
    verified: String!
    createdAt: Float!
    isFollowing: Boolean!
    id: Float!
    following: [UserInfoMinimal]
    followers: [UserInfoMinimal]
    collections: [Collection]
    posts: [PostInfoNew]
  }

  type PostInfoNew {
    id: Float!
    url: String!
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
    createdAt: String!
    description: String
    collectionName: String!
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
    firstName: String!
    lastName: String!
    password: String!
  }
`;
