import { useCheckIfLoggedQuery } from '@graphql/user.graphql';
import React from 'react';
import Redirect from './Redirect';

const RedirectLogged = () => {
  const { data, loading, error } = useCheckIfLoggedQuery();

  if (!loading && !error) {
    if (data!.checkIfLogged.logged) return <Redirect to="/" />;
  }
  return null;
};

export default RedirectLogged;
