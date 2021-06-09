import { useState } from 'react';
import Log_in from './login';
import Sign_up from './signup';
import React from 'react';

const Login = () => {
  const [form, setForm] = useState('login');
  return (
    <>
      <br />
      {form == 'signup' ? <Sign_up setForm={setForm} /> : <Log_in />}
      <br />
      <button onClick={() => setForm(form == 'signup' ? 'login' : 'signup')}>
        {form == 'signup' ? 'log in' : 'sign up'}
      </button>
    </>
  );
};

export default Login;
