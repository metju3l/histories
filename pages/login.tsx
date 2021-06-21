import { useState } from 'react';
import Log_in from '../src/components/login/login';
import Sign_up from '../src/components/login/signup';
import React from 'react';

const Login = () => {
  const [form, setForm] = useState<string>('login');
  return (
    <div>
      <br />
      {form == 'signup' ? <Sign_up setForm={setForm} /> : <Log_in />}

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
