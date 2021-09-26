import { useRouter } from 'next/router';

const RouteUnverified = ({
  logged,
  verified,
}: {
  logged: boolean;
  verified: boolean | undefined | null;
}) => {
  const router = useRouter();
  if (logged && verified === false) router.replace('/checkYourEmail');
};

export default RouteUnverified;
