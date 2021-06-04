import { useState } from 'react';
import { supabase } from '../../utils/initSupabase';
import Log_in from './login';
import Sign_up from './signup';

const Login = () => {
  const [form, setForm] = useState('login');
  const [user] = useState(supabase.auth.user());
  return (
    <>
      logged in: {user !== null && user.email}
      <br />
      {form == 'signup' ? <Sign_up /> : <Log_in />}
      <br />
      <button onClick={() => setForm(form == 'signup' ? 'login' : 'signup')}>
        {form == 'signup' ? 'log in' : 'sign up'}
      </button>
    </>
  );
};

export default Login;
