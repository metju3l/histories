import { RouteUnverified } from '@components/Router';
import { useCheckIfLoggedQuery } from '@graphql/user.graphql';
import { useRouter } from 'next/router';

const CheckYourEmail = () => {
  const checkIfLoggedQuery = useCheckIfLoggedQuery();
  const router = useRouter();

  if (checkIfLoggedQuery.loading) return <div>Loading</div>;
  if (checkIfLoggedQuery.error) return <div>error</div>;

  if (checkIfLoggedQuery.data!.checkIfLogged.verified !== false)
    router.push('/');

  return (
    <div>
      {'check your email -> click on link to validate email address -> refresh'}
    </div>
  );
};

export default CheckYourEmail;
