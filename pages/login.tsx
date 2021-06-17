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

      <button
        className="ml-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => setForm(form == 'signup' ? 'login' : 'signup')}
      >
        {form == 'signup' ? 'log in' : 'sign up'}
      </button>
    </div>
  );
};

export default Login;
