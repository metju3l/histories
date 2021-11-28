import { Button } from '@components/Button/';
import { Input } from '@components/Input';
import { Layout } from '@components/Layout';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import { useCreateUserMutation } from '@graphql/user.graphql';
import Link from 'next/link';
import router from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  ValidateEmail,
  ValidateName,
  ValidatePassword,
  ValidateUsername,
} from 'shared/validation';

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
    emailSubscription: false,
  };

  const [formValues, setFormValues] = useState(formInputs);
  const [errors, setErrors] = useState(formInputs);

  if (loading) return <div></div>;
  if (error) return <div></div>;
  if (data!.isLogged) router.replace('/');

  return (
    <Layout redirectLogged title={'sign up | hiStories'}>
      <div className="p-10 m-auto max-w-[27rem]">
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
          <div className="flex gap-4">
            <Input
              placeholder="First name"
              autoComplete="given-name"
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

            <Input
              placeholder="Last name"
              autoComplete="family-name"
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
          </div>
          <Input
            placeholder="Username"
            autoComplete="username"
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

          <Input
            placeholder="Email"
            type="email"
            autoComplete="email"
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

          <Input
            placeholder="Password"
            type="password"
            autoComplete="new-password"
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

          <Input
            placeholder="Repeat password"
            type="password"
            autoComplete="new-password"
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

          <label className="inline-flex items-center mt-3">
            <input
              type="checkbox"
              className="w-5 h-5 text-orange-600 rounded-lg form-checkbox"
              checked={formValues.emailSubscription}
              onClick={() =>
                setFormValues({
                  ...formValues,
                  emailSubscription: !formValues.emailSubscription,
                })
              }
            />
            <span className="ml-2 text-gray-700">Send me email updates</span>
          </label>

          <div className="mt-2 mb-2">
            <Button isLoading={isLoading}>Sign up</Button>
          </div>
          <Link href="/login">
            <a className="pl-2 underline">login to an existing account</a>
          </Link>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
