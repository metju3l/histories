import ApollerServer, {
  gql,
  ApolloServer,
  makeExecutableSchema,
} from 'apollo-server-micro';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { join } from 'path';
import neo4j from 'neo4j-driver';

const loadedFiles = loadFilesSync(join(process.cwd(), '**/*.graphqls'));
const typeDefs = mergeTypeDefs(loadedFiles);

const resolvers = {
  Query: {
    // @ts-ignore
    hello: (_parent, _args, _context) => {
      return 'Hello';
    },
  },
  Mutation: {
    // @ts-ignore
    createUser: (_parent, { input }, _context) => {
      const driver = neo4j.driver(
        process.env.NEO4J_HOST || 'bolt://localhost:7687',
        neo4j.auth.basic(
          process.env.NEO4J_USER || 'neo4j',
          process.env.NEO4J_PASSWORD || 'password'
        )
      );

      const session = driver.session();

      session
        .run(
          `Create (n:user {username : "${input.username}", first_name:"${
            input.first_name
          }",last_name:"${input.last_name}", email:"${
            input.email
          }", password:"${
            input.password
          }", authenticated:"false", created_at:"${new Date().getTime()}"} )`
        )
        .then(function (result) {
          result.records.forEach(function (record) {
            console.log(record.get('name'));
          });
          session.close();
        })
        .catch(function (error) {
          console.log(error);
        });

      driver.close();
      return 'done';
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
