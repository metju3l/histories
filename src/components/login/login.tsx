import Head from 'next/head';
import { useState } from 'react';
import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const checkCredentials = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return;
};

const Log_in = () => {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <>
      <Head>
        <title>{t('log in')}</title>
        <meta name="description" content="login to histories" />
      </Head>
      <div className="bg-red-500">{errorMessage}</div>
      {t('email')}
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        type="email"
        value={credentials.email}
        onChange={(e) =>
          setCredentials({ ...credentials, email: e.target.value })
        }
      />
      <label>{t('password')}</label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        type="password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        log in
      </button>
    </>
  );
};

export default Log_in;
