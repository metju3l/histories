import { Input } from '@components/elements';
import Button from '@components/elements/buttons/Button';
import GoogleAuthButton from '@components/elements/buttons/GoogleAuth';
import AuthLayout from '@components/layouts/Auth';
import { useLoginMutation } from '@graphql/mutations/auth.graphql';
import { RedirectLogged } from '@src/functions/ServerSideProps';
import LoginFormInputs from '@src/types/forms/loginFormInputs';
import Cookie from 'js-cookie';
import Link from 'next/link';
import Router from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const [login] = useLoginMutation(); // login mutation
  const [loading, setLoading] = useState(false); // loading after submiting
  const { t } = useTranslation(); // translation

  const { register, handleSubmit } = useForm<LoginFormInputs>();

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
    <AuthLayout
      heading={t('login_to_your_account')}
      head={{
        title: `Log in | HiStories`,
        description: `Log in to your HiStories account`,
        canonical: 'https://www.histories.cc/login',
        openGraph: {
          title: `Log in | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/login',
          description: `Log in to your HiStories account`,
          site_name: 'Log in page',
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Input
          label={t('username_or_email')}
          register={register}
          name="login"
          options={{ required: true, minLength: 2, maxLength: 256 }}
          autoComplete="username"
        />
        <Input
          label={t('password')}
          type="password"
          register={register}
          name="password"
          options={{ required: true, minLength: 8 }}
          autoComplete="password"
        />
        <Button style="primary_solid" loading={loading}>
          {t(loading ? 'loading' : 'login')}
        </Button>

        <GoogleAuthButton text={t('google_login')} />
        <Link href="/register">
          <a className="pl-2 underline">{t('create_new_account')}</a>
        </Link>
        <Link href="/forgot-password">
          <a className="pl-2 underline">{t('forgot_password')}</a>
        </Link>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps = RedirectLogged;

export default Login;
