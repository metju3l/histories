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
      <section className="px-4 sm:px-8 py-6 m-auto max-w-[28rem] bg-white rounded-2xl shadow-lg mt-24">
        <h1 className="font-bold text-3xl pb-3">{heading}</h1>
        {children}
      </section>
    </Main>
  );
};

export default AuthLayout;
