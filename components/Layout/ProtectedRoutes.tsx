import { Redirect } from '@components/Router';
import { useCheckIfLoggedQuery } from '@graphql/user.graphql';

const ProtectedRoutes: React.FC<{
  dontRedirectUnverified?: boolean;
  redirectLogged?: boolean;
  redirectNotLogged?: boolean;
}> = ({ dontRedirectUnverified, redirectLogged, redirectNotLogged }) => {
  const { data, loading, error } = useCheckIfLoggedQuery();

  if (loading) return null;
  if (error) return null;

  // dont redirect if user is not verified
  if (dontRedirectUnverified !== true && data!.checkIfLogged.verified === false)
    return <Redirect to="/verify" />;

  // redirect if user is logged
  if (redirectLogged && data!.checkIfLogged.logged) return <Redirect to="/" />;

  // redirect if user is not logged
  if (redirectNotLogged && !data!.checkIfLogged.logged)
    return <Redirect to="/" />;

  return null;
};

export default ProtectedRoutes;
