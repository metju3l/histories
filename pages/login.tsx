import { useState } from 'react';
import { LogIn, SignUp } from '../src/components/login';
import React from 'react';
// eslint-disable-next-line
const jwt = require('jsonwebtoken');

const Login = () => {
  const [form, setForm] = useState<string>('login');
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
