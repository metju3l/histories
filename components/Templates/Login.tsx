import LoginForm from '@components/Modules/Forms/LoginForm';
import { useLoginMutation } from '@graphql/user.graphql';
import LoginFormInputs from '@lib/types/forms/loginFormInputs';
import Cookie from 'js-cookie';
import Router from 'next/router';
import React, { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

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
    <LoginForm
      onSubmit={handleSubmit(onSubmit)}
      register={register}
      loading={loading}
    />
  );
};

export default LoginTemplate;
