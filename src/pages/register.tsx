import AuthLayout from '@components/layouts/Auth';
import RegisterForm from '@components/modules/forms/RegisterForm';
import { useCreateUserMutation } from '@graphql/mutations/auth.graphql';
import { RedirectLogged } from '@src/functions/ServerSideProps';
import RegisterFormInputs from '@src/types/forms/registerFormInputs';
import Cookie from 'js-cookie';
import Router from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Register: React.FC = () => {
  const [createAccount] = useCreateUserMutation(); // create new user mutation
  const [loading, setLoading] = useState(false); // loading after submit
  const { t } = useTranslation(); // translation
  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    if (data.password !== data.repeatPassword) {
      toast.error(t('passwords_not_match'));
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
    <AuthLayout
      heading={t('create_new_account')}
      head={{
        title: `Sign up | HiStories`,
        description: `Create new HiStories account`,
        canonical: 'https://www.histories.cc/register',
        openGraph: {
          title: `Sign up | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/register',
          description: `Create new HiStories account`,
          site_name: 'Sign up page',
        },
      }}
    >
      <RegisterForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        loading={loading}
      />
    </AuthLayout>
  );
};

export const getServerSideProps = RedirectLogged;

export default Register;
