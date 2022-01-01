import GoogleAuthButton from '@components/Elements/Buttons/GoogleAuth';
import { useLoginMutation } from '@graphql/user.graphql';
import Cookie from 'js-cookie';
import Link from 'next/link';
import Router from 'next/router';
import React, { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

type LoginFormInputs = {
  login: string;
  password: string;
};

const LoginTemplate: FC = () => {
  const [login] = useLoginMutation();
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoading(true);
    try {
      const result = await login({
        variables: {
          input: {
            username: data.login,
            password: data.password,
          },
        },
      });
      if (result.data?.login !== 'error') {
        // login successful
        Cookie.set('jwt', result.data?.login as string, {
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div>
        <h4 className="pt-0 pb-2 font-medium text-gray-600">
          {t('username or email')}
        </h4>
        <input
          className="w-full px-2 text-gray-600 border border-gray-300 outline-none rounded-md focus:border-gray-500 py-1.5"
          type="text"
          {...register('login', { required: true })}
        />
      </div>
      <div>
        <h4 className="pt-0 pb-2 font-medium text-gray-600">{t('password')}</h4>
        <input
          className="w-full px-2 text-gray-600 border border-gray-300 outline-none rounded-md focus:border-gray-500 py-1.5"
          type="password"
          {...register('password', { required: true })}
        />
      </div>
      <button
        type="submit"
        className="block px-4 mt-6 font-medium bg-gray-800 border border-gray-800 py-1.5 rounded-md text-gray-50"
      >
        {t(loading ? 'loading' : 'login')}
      </button>
      <GoogleAuthButton />

      <Link href="/register">
        <a className="pl-2 underline">{t('create new account')}</a>
      </Link>
    </form>
  );
};

export default LoginTemplate;
