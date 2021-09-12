import React, { FC, useState } from 'react';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import router from 'next/router';
import Link from 'next/link';
import { useCreateUserMutation } from '@graphql/user.graphql';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-hot-toast';
import { Button } from '@nextui-org/react';
import { Navbar } from '@components/Navbar';

const SignUp = (props: { setForm: (string: string) => void }): JSX.Element => {
  const [createUser] = useCreateUserMutation();
  const { t } = useTranslation();
  const { data, loading, error } = useIsLoggedQuery();
  const [isLoading, setIsLoading] = useState(false);
  if (loading) return <div></div>;
  if (error) return <div></div>;
  if (data!.isLogged) router.replace('/');

  return (
    <body className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <Navbar data={data} />
      <div className="max-w-screen-xl m-auto p-10">
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
            setIsLoading(true);
            try {
              await createUser({
                variables: values,
              });
              router.push('/login');
            } catch (error) {
              toast.error(error.message);
            }
            setIsLoading(false);
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
              <div className="mt-4">
                {isLoading ? (
                  <Button loading loaderType="spinner" />
                ) : (
                  <Button type="submit">Submit</Button>
                )}
                <Link href="/login">
                  <a className="underline pl-2">or login to existing account</a>
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </body>
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
    </div>
  );
};
