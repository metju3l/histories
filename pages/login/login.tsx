import Head from 'next/head';
import { useState } from 'react';
import { supabase } from '../../utils/initSupabase';
import React from 'react';

const createUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { error, data } = await supabase.auth.signIn({
    email: email,
    password: password,
  });
};

const Log_in = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  return (
    <>
      <Head>
        <title>log in</title>
        <meta name="description" content="login to histories" />
      </Head>
      email
      <input
        type="email"
        value={credentials.email}
        onChange={(e) =>
          setCredentials({ ...credentials, email: e.target.value })
        }
      />
      <br />
      password
      <input
        type="password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      <br />
      <button onClick={() => createUser(credentials)}>log in</button>
    </>
  );
};

export default Log_in;
