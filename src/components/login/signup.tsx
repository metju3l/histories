import { useCreateUserMutation } from '../../graphql/createUser.graphql';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import React from 'react';
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
  ErrorMessage,
} from 'formik';
import * as Yup from 'yup';

const Input = ({
  type,
  name,
  autoComplete,
  label,
}: {
  type: string;
  name: string;
  autoComplete: string;
  label: string;
}) => {
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

const SignUp = (props: { setForm: (string: any) => void }) => {
  const [createUser] = useCreateUserMutation();
  const { t } = useTranslation();

  const ValidateSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    lastName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    username: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(8, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords do not match')
      .required('Required'),
  });

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
        validationSchema={ValidateSchema}
        onSubmit={async (values) => {
          try {
            const result = await createUser({
              variables: {
                username: values.username,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
              },
            });
            // @ts-ignore
            if (result.data.createUser === 'user created')
              props.setForm('login');
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {(props) => (
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
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SignUp;
