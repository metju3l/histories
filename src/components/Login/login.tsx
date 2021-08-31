import Head from 'next/head';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLoginMutation } from '@graphql/user.graphql';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';

const Input: FC<{
  type: string;
  name: string;
  autoComplete: string;
  label: string;
}> = ({ type, name, autoComplete, label }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Field
        type={type}
        className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        name={name}
        autoComplete={autoComplete}
      />
      <ErrorMessage name={name} />
      <br />
    </div>
  );
};

const LogIn: FC = () => {
  const [login] = useLoginMutation();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{t('log in')}</title>
        <meta name="description" content="login to histories" />
      </Head>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={async (values) => {
          try {
            const result = await login({
              variables: values,
            });
            if (result.data?.login !== 'error') {
              // login successful
              Cookie.set('jwt', result.data?.login as string, {
                sameSite: 'strict',
              });
              router.reload();
            }
          } catch (error) {
            console.log('error');
          }
        }}
      >
        {() => (
          <Form>
            <Input
              label="Username"
              name="username"
              type="text"
              autoComplete="username"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              submit
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LogIn;
