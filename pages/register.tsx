import React, { FC } from 'react';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import router from 'next/router';
import Link from 'next/link';
import { useCreateUserMutation } from '@graphql/user.graphql';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const SignUp = (props: { setForm: (string: string) => void }): JSX.Element => {
  const [createUser] = useCreateUserMutation();
  const { t } = useTranslation();
  const { data, loading, error } = useIsLoggedQuery();
  if (loading) return <div></div>;
  if (error) return <div></div>;
  if (data!.isLogged.isLogged) router.replace('/');

  return (
    <>
      <Head>
        <title>{t('sign up')}</title>
        <meta name="description" content="login to histories" />
      </Head>

      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          password: '',
          repeatPassword: '',
        }}
        onSubmit={async (values) => {
          try {
            const result = await createUser({
              variables: values,
            });
            // @ts-ignore
            if (result.data.createUser === 'user created') {
              router.push('/login');
            }
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {() => (
          <Form>
            <Input
              label="First name"
              name="firstName"
              type="text"
              autoComplete="given-name"
            />
            <Input
              label="Last name"
              name="lastName"
              type="text"
              autoComplete="family-name"
            />
            <Input
              label="Username"
              name="username"
              type="text"
              autoComplete="username"
            />{' '}
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
            />
            <Input
              label="Repeat password"
              name="repeatPassword"
              type="password"
              autoComplete="new-password"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              submit
            </button>
            <Link href="/login">log in</Link>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SignUp;

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
