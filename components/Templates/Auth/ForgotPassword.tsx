import ForgotPasswordForm from '@components/Modules/Forms/ForgotPasswordForm';
import ForgotPasswordFormInputs from '@lib/types/forms/forgotPasswordFormInputs';
import React, { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const ForgotPasswordTemplate: FC = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<ForgotPasswordFormInputs>();

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    setLoading(true);
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
