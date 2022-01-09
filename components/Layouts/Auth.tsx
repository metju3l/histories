import HeadProps from '@lib/types/head';
import React from 'react';

import Main from './Main';

export type AuthLayoutProps = { head: HeadProps };

const AuthLayout: React.FC<AuthLayoutProps> = ({ head, children }) => {
  return (
    <Main head={head}>
      <div className="p-10 m-auto max-w-[27rem]">{children}</div>
    </Main>
  );
};



export default AuthLayout;
