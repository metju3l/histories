import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { MeQuery } from '@graphql/queries/user.graphql';

interface IMeContext {
  data: MeQuery | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: (() => Promise<ApolloQueryResult<MeQuery>>) | undefined;
}

export default IMeContext;
