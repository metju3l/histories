import React from 'react';
import Layout from '@components/MainPage/Layout';
import { useCheckIfLoggedQuery } from '@graphql/user.graphql';
import { RouteUnverified } from '@components/Router';

const Index = () => {
  const checkIfLoggedQuery = useCheckIfLoggedQuery();

  if (checkIfLoggedQuery.loading) return <div>Loading</div>;
  if (checkIfLoggedQuery.error) return <div>error</div>;

  RouteUnverified({
    logged: checkIfLoggedQuery.data?.checkIfLogged.logged ?? false,
    verified: checkIfLoggedQuery.data?.checkIfLogged.verified,
  });

  return <Layout />;
};

export default Index;
