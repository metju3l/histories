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

// @ts-ignore
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

      <label className="block">{t('first name')}</label>
      <input
        className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        value={credentials.firstName}
        onChange={(e) =>
          setCredentials({
            ...credentials,
            firstName: e.target.value,
          })
        }
      />
      <label>{t('last name')}</label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        value={credentials.lastName}
        onChange={(e) =>
          setCredentials({ ...credentials, lastName: e.target.value })
        }
      />
      <label>{t('username')}</label>
      <input
        className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
      />
      <label>{t('email')}</label>
      <input
        className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        type="email"
        value={credentials.email}
        onChange={(e) =>
          setCredentials({ ...credentials, email: e.target.value })
        }
      />
      <label>{t('password')}</label>
      <input
        className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        type="password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      <label>{t('repeat password')}</label>
      <input
        className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        type="password"
        value={credentials.repeatPassword}
        onChange={(e) =>
          setCredentials({ ...credentials, repeatPassword: e.target.value })
        }
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={async () => {
          if (credentials.password !== credentials.repeatPassword)
            setErrorMessage('passwords do not match');
        }}
      >
        {t('sign up')}
      </button>
    </>
  );
};

export default Sign_up;
