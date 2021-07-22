import { useState } from 'react';
import { LogIn, SignUp } from '@components/login';
import React from 'react';
import { useIsLoggedQuery } from '../src/graphql/user.graphql';
import { useRouter } from 'next/router';

const Login = (): JSX.Element => {
  const { data, loading, error } = useIsLoggedQuery();
  const [form, setForm] = useState<string>('login');
  const router = useRouter();

  if (loading) return <div></div>;
  if (error) return <div></div>;

  if (data!.isLogged) router.replace('/');

  return (
    <div>
      <br />
      {form == 'signup' ? <SignUp setForm={setForm} /> : <LogIn />}

      <a
        className="underline"
        onClick={() => setForm(form == 'signup' ? 'login' : 'signup')}
      >
        {form == 'signup'
          ? 'I already have an account'
          : 'or create a new account'}
      </a>
    </div>
  );
};

export default Login;
