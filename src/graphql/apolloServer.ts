import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { verify } from 'jsonwebtoken';
import schema from './schema';
import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload';

const apolloServer = new ApolloServer({
  schema,
  context: (context) => {
    try {
      // get JWT
      const jwt = context.req.headers.authorization!.substring(7);
      // verify JWT
      const decoded = verify(jwt, process.env.JWT_SECRET!);
      return { validToken: true, decoded: decoded };
      // if JWT is nto valid
    } catch (err) {
      return { validToken: false, decoded: null };
    }
  },
});

export const ApplyMidleware = async (server: any) => {
  await apolloServer.start();

  await apolloServer.applyMiddleware({
    app: server,
    path: '/api/graphql',
  });
};
