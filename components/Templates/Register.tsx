import { Button } from '@components/Elements';
import GoogleAuthButton from '@components/Elements/Buttons/GoogleAuth';
import { useCreateUserMutation } from '@graphql/user.graphql';
import RegisterFormInputs from '@lib/types/registerFormInputs';
import Cookie from 'js-cookie';
import Link from 'next/link';
import Router from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const RegisterTemplate: React.FC = () => {
  const [createAccount] = useCreateUserMutation();
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    if (data.password !== data.repeatPassword) {
      toast.error('Passwords must match');
      return;
    }

    setLoading(true);
    try {
      const result = await createAccount({
        variables: {
          input: {
            username: data.username,
            password: data.password,
            email: data.email,
            firstName: data.firstName,
            emailSubscription: data.notifications,
            lastName: data.lastName,
            locale: navigator.language,
          },
        },
      });
      if (result.data?.createUser !== 'error') {
        // register successful
        Cookie.set('jwt', result.data?.createUser as string, {
          sameSite: 'strict',
        });
        Router.reload();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-10 m-auto max-w-[27rem]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <input
          placeholder="First name"
          autoComplete="given-name"
          {...register('firstName', { required: true, maxLength: 50 })}
        />

        <input
          placeholder="Last name"
          autoComplete="family-name"
          {...register('lastName', { required: true, maxLength: 50 })}
        />
        <input
          placeholder="Username"
          autoComplete="username"
          {...register('username', {
            required: true,
            minLength: 3,
            maxLength: 32,
          })}
        />

        <input
          placeholder="Email"
          type="email"
          autoComplete="email"
          {...register('email', { required: true })}
        />

        <input
          placeholder="Password"
          type="password"
          autoComplete="new-password"
          {...register('password', { required: true, minLength: 8 })}
        />

        <input
          placeholder="Repeat password"
          type="password"
          autoComplete="new-password"
          {...register('repeatPassword', { required: true, minLength: 8 })}
        />

        <label className="inline-flex items-center mt-3">
          <input
            type="checkbox"
            className="w-5 h-5 text-orange-600 rounded-lg form-checkbox"
            {...register('notifications')}
          />
          <span className="ml-2 text-gray-700">Send me email updates</span>
        </label>

        <div className="mt-2 mb-2">
          <Button isLoading={loading}>Sign up</Button>
        </div>
        <GoogleAuthButton />
        <Link href="/login">
          <a className="pl-2 underline">login to an existing account</a>
        </Link>
      </form>
    </div>
  );
};

export default RegisterTemplate;
