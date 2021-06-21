import ApollerServer, { gql, ApolloServer } from 'apollo-server-micro';
import { Neo4jGraphQL } from '@neo4j/graphql';
import neo4j from 'neo4j-driver';

const typeDefs = gql`
  type Query {
    hello: String!
  }
  type Mutation {
    createUser(
      username: String!
      email: String!
      first_name: String!
      last_name: String!
      password: String!
    ): String!
  }
`;

const resolvers = {
  Query: {
    // @ts-ignore
    hello: (_parent, _args, _context) => {
      return 'Hello';
    },
  },
  Mutation: {
    // @ts-ignore
    createUser: (_parent, args, _context) => {
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
          `Create (n:user {username : "${args.username}", first_name:"${
            args.first_name
          }",last_name:"${args.last_name}", email:"${args.email}", password:"${
            args.password
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

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = apolloServer.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
