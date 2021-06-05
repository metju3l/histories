import Head from 'next/head';
import { useState } from 'react';
import { supabase } from '../../utils/initSupabase';
import React from 'react';

const createUser = async ({
  firstName,
  lastName,
  username,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}) => {
  const { error, data } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
};

const Sign_up = ({ setForm }: { setForm: () => void }) => {
  const [credentials, setCredentials] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });
  return (
    <>
      <Head>
        <title>sign up</title>
        <meta name="description" content="login to histories" />
      </Head>
      first name
      <input
        type="text"
        value={credentials.firstName}
        onChange={(e) =>
          setCredentials({
            ...credentials,
            firstName: e.target.value,
          })
        }
      />
      <br />
      last name
      <input
        type="text"
        value={credentials.lastName}
        onChange={(e) =>
          setCredentials({ ...credentials, lastName: e.target.value })
        }
      />
      <br />
      username
      <input
        type="text"
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
      />
      <br />
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
      <button
        onClick={() => {
          createUser(credentials);
          setForm('login');
        }}
      >
        sign up
      </button>
    </>
  );
};

export default Sign_up;
