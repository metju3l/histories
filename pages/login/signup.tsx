import Head from 'next/head';
import { useState } from 'react';
import { supabase } from '../../utils/initSupabase';
import React from 'react';
import 'tailwindcss/tailwind.css';

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
  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  return error;
};

const Sign_up = ({ setForm }: { setForm: () => void }) => {
  const [credentials, setCredentials] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <>
      <Head>
        <title>sign up</title>
        <meta name="description" content="login to histories" />
      </Head>
      <div className="bg-red-500">{errorMessage}</div>
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
      repeat password
      <input
        type="password"
        value={credentials.repeatPassword}
        onChange={(e) =>
          setCredentials({ ...credentials, repeatPassword: e.target.value })
        }
      />
      <br />
      <button
        onClick={async () => {
          if (credentials.password === credentials.repeatPassword) {
            const msg = await createUser(credentials);
            if (msg === null) setForm('login');
            else setErrorMessage(msg.message);
          } else {
            setErrorMessage('passwords do not match');
          }
        }}
      >
        sign up
      </button>
    </>
  );
};

export default Sign_up;
