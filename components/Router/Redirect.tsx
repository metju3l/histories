import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Redirect: React.FC<{ to: string }> = ({ to }) => {
  const router = useRouter();

  useEffect(() => {
    router.push(to);
  }, [to]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default Redirect;
