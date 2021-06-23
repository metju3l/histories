import { useCreateUserMutation } from '../../graphql/user.graphql';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import React from 'react';
import { ErrorMessage, Formik } from 'formik';
import * as Yup from 'yup';

// @ts-ignore
const Sign_up = (setForm) => {
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
      .oneOf([Yup.ref('password'), null], "Passwords don't match")
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
          console.log(values);
          try {
            await createUser({
              variables: {
                username: values.username,
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email,
                password: values.password,
              },
            });
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {(props) => (
          <div>
            <label>First name</label>
            <input
              type="text"
              className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              onChange={props.handleChange('firstName')}
              value={props.values.firstName}
            />
            <ErrorMessage name="firstName" />
            <br />

            <label>Last name</label>
            <input
              type="text"
              className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              onChange={props.handleChange('lastName')}
              value={props.values.lastName}
            />
            <ErrorMessage name="lastName" />
            <br />

            <label>Username</label>
            <input
              type="text"
              className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              onChange={props.handleChange('username')}
              value={props.values.username}
            />
            <ErrorMessage name="username" />
            <br />

            <label>Email</label>
            <input
              type="email"
              className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              onChange={props.handleChange('email')}
              value={props.values.email}
            />
            <ErrorMessage name="email" />
            <br />

            <label>Password</label>
            <input
              type="password"
              className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              onChange={props.handleChange('password')}
              value={props.values.password}
            />
            <ErrorMessage name="password" />
            <br />

            <label>Repeat password</label>
            <input
              type="password"
              className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              onChange={props.handleChange('repeatPassword')}
              value={props.values.repeatPassword}
            />
            <ErrorMessage name="repeatPassword" />
            <br />

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              onClick={() => props.handleSubmit()}
            >
              submit
            </button>
          </div>
        )}
      </Formik>
    </>
  );
};

export default Sign_up;
