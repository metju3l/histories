import ApollerServer, { gql, ApolloServer } from 'apollo-server-micro';
import { Neo4jGraphQL } from '@neo4j/graphql';
import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
  process.env.NEO4J_HOST || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  )
);

const session = driver.session();
session.run('CREATE (n:Person {name: "Kahy", title: "Developer"})');

const typeDefs = gql`
  type Query {
    hello: String!
  }
`;

const resolvers = {
  Query: {
    // @ts-ignore
    hello: (_parent, _args, _context) => {
      return 'Hello';
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
