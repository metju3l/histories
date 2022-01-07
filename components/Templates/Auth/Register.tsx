import RegisterForm from '@components/Modules/Forms/RegisterForm';
import { useCreateUserMutation } from '@graphql/user.graphql';
import RegisterFormInputs from '@lib/types/forms/registerFormInputs';
import Cookie from 'js-cookie';
import Router from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const RegisterTemplate: React.FC = () => {
  const [createAccount] = useCreateUserMutation();
  const [loading, setLoading] = useState(false);

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
      <RegisterForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        loading={loading}
      />
    </div>
  );
};

export default RegisterTemplate;
