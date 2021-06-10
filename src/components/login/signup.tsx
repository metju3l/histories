import Head from 'next/head';
import { useState } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

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
  return;
};
const Sign_up = (setForm) => {
  const { t } = useTranslation();
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
        <title>{t('sign up')}</title>
        <meta name="description" content="login to histories" />
      </Head>
      <div className="bg-red-500">{errorMessage}</div>
      {t('first name')}
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
      {t('last name')}
      <input
        type="text"
        value={credentials.lastName}
        onChange={(e) =>
          setCredentials({ ...credentials, lastName: e.target.value })
        }
      />
      <br />
      {t('username')}
      <input
        type="text"
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
      />
      <br />
      {t('email')}
      <input
        type="email"
        value={credentials.email}
        onChange={(e) =>
          setCredentials({ ...credentials, email: e.target.value })
        }
      />
      <br />
      {t('password')}
      <input
        type="password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      <br />
      {t('repeat password')}
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
          setErrorMessage('passwords do not match');
        }}
      >
        {t('sign up')}
      </button>
    </>
  );
};

export default Sign_up;
