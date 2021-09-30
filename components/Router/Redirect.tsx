import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Redirect: React.FC<{ to: string }> = ({ to }) => {
  const router = useRouter();

  useEffect(() => {
    router.push(to);
  }, [to]);

  return null;
};

export default Redirect;
