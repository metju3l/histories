import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { LoginContext } from '../../pages/_app';
import Main, { HeadProps } from './Main';

export type AuthLayoutProps = { head: HeadProps };

const AuthLayout: React.FC<AuthLayoutProps> = ({ head, children }) => {
  // login context
  const { data } = React.useContext(LoginContext);

  const router = useRouter();

  useEffect(() => {
    // if user is logged redirect to home
    if (data?.me?.id) router.push('/');
  }, [data]);

  return (
    <Main head={head}>
      <div className="p-10 m-auto max-w-[27rem]">{children}</div>
    </Main>
  );
};

export default AuthLayout;
