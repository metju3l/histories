import HeadProps from '@src/types/head';
import React from 'react';

import Main from './Main';

export type AuthLayoutProps = { head: HeadProps };

const AuthLayout: React.FC<AuthLayoutProps> = ({ head, children }) => {
  return (
    <Main head={head}>
      <section className="px-2 pt-6 m-auto max-w-[28rem]">{children}</section>
    </Main>
  );
};

export default AuthLayout;
