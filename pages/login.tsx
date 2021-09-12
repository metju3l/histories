import React, { FC, useState } from 'react';
import { useIsLoggedQuery, useLoginMutation } from '@graphql/user.graphql';
import Link from 'next/link';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import router from 'next/router';
import { useTranslation } from 'react-i18next';
import Cookie from 'js-cookie';
import { toast } from 'react-hot-toast';
import { Button } from '@nextui-org/react';

const Login: FC = () => {
  const { data, loading, error } = useIsLoggedQuery();
  const [login] = useLoginMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  if (loading) return <div></div>;
  if (error) return <div></div>;

  if (data!.isLogged) router.replace('/');

  return (
    <div>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={async (values) => {
          setIsLoading(true);
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
            toast.error(error.message);
          }
          setIsLoading(false);
        }}
      >
        {() => (
          <Form>
            <Input
              label="Username or email"
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
            {isLoading ? (
              <Button loading loaderType="spinner" />
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </Form>
        )}
      </Formik>
      <Link href="/register">
        <a className="underline">create a new account</a>
      </Link>
    </div>
  );
};

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

export default Login;
