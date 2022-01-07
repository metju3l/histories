import ForgotPasswordForm from '@components/Modules/Forms/ForgotPasswordForm';
import { useForgotPasswordMutation } from '@graphql/user.graphql';
import ForgotPasswordFormInputs from '@lib/types/forms/forgotPasswordFormInputs';
import React, { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const ForgotPasswordTemplate: FC = () => {
  const [loading, setLoading] = useState(false);

  const [forgotPasswordMutation] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<ForgotPasswordFormInputs>();

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    setLoading(true);
    try {
      await forgotPasswordMutation({
        variables: {
          login: data.login,
        },
      });
      toast.success('Password reset was sent to your email');
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <ForgotPasswordForm
      onSubmit={handleSubmit(onSubmit)}
      register={register}
      loading={loading}
    />
  );
};

export default ForgotPasswordTemplate;
