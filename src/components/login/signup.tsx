import Head from 'next/head';
import { useState, useEffect } from 'react';
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
  const [errorMessages, setErrorMessage] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  });

  // check username
  useEffect(() => {
    const res = /^[a-zA-Z0-9_.-]+$/.exec(credentials.username);
    let error = '';

    if (credentials.username.length === 0) error = '';
    else if (!res) error = 'username cannot contain special characters';
    else error = '';

    setErrorMessage({ ...errorMessages, username: error });
  }, [credentials.username]);

  // check password and repeatPassword
  useEffect(() => {
    const error = ['', ''];
    if (credentials.password.length > 0 && credentials.password.length < 8)
      error[0] = 'password is too short';
    else error[0] = '';

    if (
      credentials.password !== credentials.repeatPassword &&
      credentials.repeatPassword.length > 0
    )
      error[1] = 'Passwords do not match';
    else error[1] = '';

    setErrorMessage({
      ...errorMessages,
      password: error[0],
      repeatPassword: error[1],
    });
  }, [credentials.password, credentials.repeatPassword]);

  // check email
  useEffect(() => {
    const res = credentials.email.match(
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    );
    let error = '';

    if (credentials.email.length === 0) error = '';
    else if (!res) error = 'This does not look like a valid email address';
    else error = '';

    setErrorMessage({ ...errorMessages, email: error });
  }, [credentials.email]);

  return (
    <>
      <Head>
        <title>{t('sign up')}</title>
        <meta name="description" content="login to histories" />
      </Head>
      <div className="w-1/2 ">
        <label className="block">{t('first name')}</label>
        <div className="bg-red-500">{errorMessages.firstName}</div>
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
        <div className="bg-red-500">{errorMessages.lastName}</div>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          value={credentials.lastName}
          onChange={(e) =>
            setCredentials({ ...credentials, lastName: e.target.value })
          }
        />
        <label>{t('username')}</label>
        <div className="bg-red-500">{errorMessages.username}</div>
        <input
          className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
        />
        <label>{t('email')}</label>
        <div className="bg-red-500">{errorMessages.email}</div>
        <input
          className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
        />
        <label>{t('password')}</label>
        <div className="bg-red-500">{errorMessages.password}</div>
        <input
          className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <label>{t('repeat password')}</label>
        <div className="bg-red-500">{errorMessages.repeatPassword}</div>
        <input
          className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          value={credentials.repeatPassword}
          onChange={(e) =>
            setCredentials({ ...credentials, repeatPassword: e.target.value })
          }
        />
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        {t('sign up')}
      </button>
    </>
  );
};

export default Sign_up;
