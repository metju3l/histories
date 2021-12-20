import { Layout } from '@components/Layout';
import Button from '@components/UI/Button';
import { useLoginMutation } from '@graphql/user.graphql';
import Cookie from 'js-cookie';
import Link from 'next/link';
import Router from 'next/router';
import React, { FC, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  login: string;
  password: string;
};

const Login: FC = () => {
  const [login] = useLoginMutation();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);

    try {
      const result = await login({
        variables: {
          username: data.login,
          password: data.password,
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
  };

  return (
    <Layout redirectLogged title={'login | hiStories'}>
      <div className="p-10 m-auto max-w-[27rem]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div>
            <h4 className="pb-2 pt-0 text-gray-600 font-medium">
              {t('username or email')}
            </h4>
            <input
              className="w-full text-gray-600 rounded-md border border-gray-300 focus:border-gray-500 outline-none py-1.5 px-2"
              type="text"
              {...register('login', { required: true })}
            />
          </div>
          <div>
            <h4 className="pb-2 pt-0 text-gray-600 font-medium">
              {t('password')}
            </h4>
            <input
              className="w-full text-gray-600 rounded-md border border-gray-300 focus:border-gray-500 outline-none py-1.5 px-2"
              type="password"
              {...register('password', { required: true })}
            />
          </div>

          <button
            type="submit"
            className="mt-6 block py-1.5 px-4 font-medium rounded-md bg-gray-800 border border-gray-800 text-gray-50"
          >
            {t('login')}
          </button>

          <Link href="/register">
            <a className="pl-2 underline">{t('create new account')}</a>
          </Link>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
