import HeadProps from '@src/types/head';
import React from 'react';

import Main from './Main';

export interface IAuthLayoutProps {
  head: HeadProps;
  heading: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<IAuthLayoutProps> = ({
  head,
  children,
  heading,
}) => {
  return (
    <Main head={head} background="bg-[#C9DEFF]">
      <section className="px-4 py-6 m-auto mt-24 bg-white shadow-lg sm:px-8 max-w-[28rem] rounded-2xl">
        <h1 className="pb-3 text-3xl font-bold">{heading}</h1>
        {children}
      </section>
    </Main>
  );
};

export default AuthLayout;
