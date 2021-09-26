import { useRouter } from 'next/router';

const RouteUnverified = ({
  isLogged,
  verified,
}: {
  isLogged: boolean;
  verified: boolean | null;
}) => {
  const router = useRouter();
  if (isLogged && !verified) router.replace('/verify');
};

export default RouteUnverified;
