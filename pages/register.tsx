import React, { useState } from 'react';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import router from 'next/router';
import Link from 'next/link';
import { useCreateUserMutation } from '@graphql/user.graphql';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { Button, Input, Spacer } from '@nextui-org/react';
import {
  ValidateEmail,
  ValidateName,
  ValidatePassword,
  ValidateUsername,
} from '@lib/validation';
import { Layout } from '@components/Layout';

const Register: React.FC = () => {
  const [createUser] = useCreateUserMutation();
  const { t } = useTranslation();
  const { data, loading, error } = useIsLoggedQuery();
  const [isLoading, setIsLoading] = useState(false);

  const formInputs = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  };

  const [formValues, setFormValues] = useState(formInputs);
  const [errors, setErrors] = useState(formInputs);

  if (loading) return <div></div>;
  if (error) return <div></div>;
  if (data!.isLogged) router.replace('/');

  return (
    <Layout redirectLogged title={''}>
      <div className="max-w-screen-xl m-auto p-10">
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setIsLoading(true);

            if (formValues.password !== formValues.repeatPassword) {
              toast.error('Passwords must match');
            } else {
              try {
                await createUser({
                  variables: formValues,
                });
                router.push('/login');
              } catch (error) {
                // @ts-ignore
                toast.error(error.message);
              }
            }
            setIsLoading(false);
          }}
        >
          <FormInput
            label="First name"
            autoComplete="given-name"
            color={errors.firstName && 'error'}
            helperText={errors.firstName && 'First name ' + errors.firstName}
            value={formValues.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...formValues, firstName: e.target.value });
              setErrors({
                ...errors,
                firstName: ValidateName(e.target.value).error ?? '',
              });
            }}
          />

          <FormInput
            label="Last name"
            autoComplete="family-name"
            color={errors.lastName && 'error'}
            helperText={errors.lastName && 'Last name ' + errors.lastName}
            value={formValues.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...formValues, lastName: e.target.value });
              setErrors({
                ...errors,
                lastName: ValidateName(e.target.value).error ?? '',
              });
            }}
          />

          <FormInput
            label="Username"
            autoComplete="username"
            color={errors.username && 'error'}
            helperText={errors.username}
            value={formValues.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...formValues, username: e.target.value });
              setErrors({
                ...errors,
                username: ValidateUsername(e.target.value).error ?? '',
              });
            }}
          />

          <FormInput
            label="Email"
            type="email"
            autoComplete="email"
            color={errors.email && 'error'}
            helperText={errors.email}
            value={formValues.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...formValues, email: e.target.value });
              setErrors({
                ...errors,
                email: ValidateEmail(e.target.value).error ?? '',
              });
            }}
          />

          <FormInput
            label="Password"
            type="password"
            autoComplete="new-password"
            color={errors.password && 'error'}
            helperText={errors.password}
            value={formValues.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...formValues, password: e.target.value });
              setErrors({
                ...errors,
                password: ValidatePassword(e.target.value).error ?? '',
              });
            }}
          />

          <FormInput
            label="Repeat password"
            type="password"
            autoComplete="new-password"
            color={errors.repeatPassword && 'error'}
            helperText={errors.repeatPassword}
            value={formValues.repeatPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...formValues, repeatPassword: e.target.value });
              setErrors({
                ...errors,
                repeatPassword:
                  ValidatePassword(e.target.value).error ??
                  formValues.password !== e.target.value
                    ? 'Passwords must match'
                    : '',
              });
            }}
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
        </form>
      </div>
    </Layout>
  );
};

const FormInput = (props: any) => {
  return (
    <div className="w-96">
      <Spacer y={1.6} />
      {props.type === 'password' ? (
        <Input.Password
          {...props}
          width="100%"
          required={true}
          labelPlaceholder="Default"
        />
      ) : (
        <>
          {props.label}
          <input
            {...props}
            className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required={true}
            type={props.type ?? 'text'}
          />
        </>
      )}
    </div>
  );
};

export default Register;
