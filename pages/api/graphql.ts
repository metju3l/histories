import { ApolloServer, makeExecutableSchema } from 'apollo-server-micro';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { join } from 'path';
import DbConnector from '../../src/database/driver';
// eslint-disable-next-line
const bcrypt = require('bcrypt');

const loadedFiles = loadFilesSync(join(process.cwd(), '**/*.graphqls'));
const typeDefs = mergeTypeDefs(loadedFiles);

const UserExists = async (user: string) => {
  const userInfoQuery = `MATCH (n:User) WHERE n.${
    user.includes('@') ? 'email' : 'username'
  }= "${user}" RETURN n`;

  const driver = DbConnector();
  const session = driver.session();

  const userInfo = await session.run(userInfoQuery);

  driver.close();

  return userInfo.records[0] === undefined ? false : true;
};

const GetUserInfo = async (user: string, queries) => {
  const userInfoQuery = `MATCH (n:User) WHERE n.${
    user.includes('@') ? 'email' : 'username'
  }= "${user}" RETURN n`;
  const followersQuery = `MATCH (a:User {username: "${user}"})<-[:FOLLOW]-(user) RETURN user`;
  const followingQuery = `MATCH (a:User {username: "${user}"})-[:FOLLOW]->(user) RETURN user`;

  const driver = DbConnector();
  const session = driver.session();

  const userInfo = await session.run(userInfoQuery);
  const following =
    queries.find((x) => x.name.value === 'following') !== undefined &&
    (await session.run(followingQuery)).records.map((x) => {
      return x.get('user').properties;
    });
  const followers =
    queries.find((x) => x.name.value === 'followers') !== undefined &&
    (await session.run(followersQuery)).records.map((x) => {
      return x.get('user').properties;
    });
  driver.close();

  return userInfo.records[0] === undefined
    ? null
    : { ...userInfo.records[0].get('n').properties, following, followers };
};

const resolvers = {
  Query: {
    // @ts-ignore
    hello: (_parent, _args, _context) => {
      return 'Hello';
    },
    // @ts-ignore
    getUserInfo: async (_parent, { input }, _context, { operation }) => {
      const queries =
        operation.selectionSet.selections[0].selectionSet.selections;

      return GetUserInfo(input.user, queries);
    },
  },
  Mutation: {
    // @ts-ignore
    createUser: async (_parent, { input }, _context) => {
      if (await UserExists(input.username)) return 'username is already used';
      else if (await UserExists(input.email)) return 'email is already used';
      else {
        const hashedPassword = await bcrypt.hash(
          input.password,
          parseInt(process.env.HASH_SALT)
        );

        const query = `Create (n:User {username : "${
          input.username
        }", first_name:"${input.first_name}",last_name:"${
          input.last_name
        }", email:"${
          input.email
        }", password:"${hashedPassword}", authenticated:"false", created_at:"${new Date().getTime()}"} )`;

        const driver = DbConnector();
        const session = driver.session();

        await session.run(query);
        driver.close();

        if (await UserExists(input.username)) return 'user created';
        return 'failed';
      }
    },
    // @ts-ignore
    deleteUser: async (_parent, { input }, _context) => {
      if (await UserExists(input.user)) return 'user does not exist';

      const query = `MATCH (n:User {${
        input.user.includes('@') ? 'email' : 'username'
      }: "${input.user}"}) DETACH DELETE n`;

      const driver = DbConnector();
      const session = driver.session();

      const result = await session.run(query);
      driver.close();

      if (await UserExists(input.user)) return 'user deleted';
      else return 'action failed';
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
