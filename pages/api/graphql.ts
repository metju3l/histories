import { ApolloServer, makeExecutableSchema } from 'apollo-server-micro';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { join } from 'path';
import DbConnector from '../../src/database/driver';
// eslint-disable-next-line
const bcrypt = require('bcrypt');

const loadedFiles = loadFilesSync(join(process.cwd(), '**/*.graphqls'));
const typeDefs = mergeTypeDefs(loadedFiles);

const GetUserInfo = async (user: string) => {
  const query = `MATCH (n:User {${
    user.includes('@') ? 'email' : 'username'
  }: "${user}"}) RETURN n`;

  const driver = DbConnector();
  const session = driver.session();

  const result = await session.run(query);
  driver.close();

  return result.records[0] === undefined
    ? null
    : result.records[0].get('n').properties;
};

const resolvers = {
  Query: {
    // @ts-ignore
    hello: (_parent, _args, _context) => {
      return 'Hello';
    },
    // @ts-ignore
    getUserInfo: async (_parent, { input }, _context) => {
      return GetUserInfo(input.user);
    },
  },
  Mutation: {
    // @ts-ignore
    createUser: async (_parent, { input }, _context) => {
      if ((await GetUserInfo(input.username)) !== null)
        return 'username is already used';
      else if ((await GetUserInfo(input.email)) !== null)
        return 'email is already used';
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

        if ((await GetUserInfo(input.username)) !== null) return 'user created';
        return 'failed';
      }
    },
    // @ts-ignore
    deleteUser: async (_parent, { input }, _context) => {
      if ((await GetUserInfo(input.user)) === null)
        return 'user does not exist';

      const query = `MATCH (n:User {${
        input.user.includes('@') ? 'email' : 'username'
      }: "${input.user}"}) DETACH DELETE n`;

      const driver = DbConnector();
      const session = driver.session();

      const result = await session.run(query);
      driver.close();

      if ((await GetUserInfo(input.user)) === null) return 'user deleted';
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
