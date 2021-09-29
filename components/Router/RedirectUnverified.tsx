import { useCheckIfLoggedQuery } from '@graphql/user.graphql';
import React from 'react';
import Redirect from './Redirect';

const RedirectUnverified = () => {
  const { data, loading, error } = useCheckIfLoggedQuery();

  if (!loading && !error)
    if (!data!.checkIfLogged.verified) return <Redirect to="/verify" />;

  return null;
};

export default RedirectUnverified;
