import React from 'react';

import { LoginContext } from '.';
import { Redirect } from './Router';

const ProtectedRoutes: React.FC<{
  dontRedirectUnverified?: boolean;
  redirectLogged?: boolean;
  redirectNotLogged?: boolean;
}> = ({ dontRedirectUnverified, redirectLogged, redirectNotLogged }) => {
  const loginContext = React.useContext(LoginContext);

  if (loginContext.loading) return null;
  if (loginContext.error) return null;

  // dont redirect if user is not verified
  if (
    dontRedirectUnverified !== true &&
    !loginContext.data?.me?.verified &&
    loginContext.data?.me?.id
  )
    return <Redirect to="/verify" />;

  // redirect if user is logged
  if (redirectLogged && loginContext.data?.me?.id) return <Redirect to="/" />;

  // redirect if user is not logged
  if (redirectNotLogged && !loginContext.data?.me?.id)
    return <Redirect to="/" />;

  return null;
};

export default ProtectedRoutes;
