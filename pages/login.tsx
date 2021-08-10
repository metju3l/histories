import React, { FC, useState } from 'react';
import { LogIn, SignUp } from '@components/Login';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import { useRouter } from 'next/router';

const Login: FC = () => {
  const [form, setForm] = useState<string>('login');
  const router = useRouter();
  const { data, loading, error } = useIsLoggedQuery();
  if (loading) return <div></div>;
  if (error) return <div></div>;
  if (data!.isLogged.isLogged) {
    router.replace('/');
  }

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
