import React from 'react';

import { Redirect } from '../Router';
import { LoginContext } from '.';

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
    !loginContext.data?.isLogged?.verified &&
    loginContext.data?.isLogged?.id
  )
    return <Redirect to="/verify" />;

  // redirect if user is logged
  if (redirectLogged && loginContext.data?.isLogged?.id)
    return <Redirect to="/" />;

  // redirect if user is not logged
  if (redirectNotLogged && !loginContext.data?.isLogged?.id)
    return <Redirect to="/" />;

  return null;
};

export default ProtectedRoutes;
