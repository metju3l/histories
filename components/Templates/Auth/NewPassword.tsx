import NewPasswordForm from '@components/Modules/Forms/NewPasswordFormInputs';
// import { useChangePasswordMutation } from '@graphql/user.graphql';
import NewPasswordFormInputs from '@lib/types/forms/newPasswordFormInputs';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const NewPasswordTemplate: React.FC<{ token: string }> = ({ token }) => {
  const [loading, setLoading] = useState(false);

  // const [changePassword] = useChangePasswordMutation();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<NewPasswordFormInputs>();

  const onSubmit: SubmitHandler<NewPasswordFormInputs> = async (data) => {
    setLoading(true);
    if (
      data.password != data.repeatPassword ||
      data.password.length < 8 ||
      data.repeatPassword.length < 8
    ) {
      toast.error('Unexpected error, try different password');
      setLoading(false);
      return;
    }

    try {
      /*await changePassword({
        variables: {
          


        },
      });
*/
      toast.success('Your password has been changed');

      router.replace('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <NewPasswordForm
      onSubmit={handleSubmit(onSubmit)}
      register={register}
      loading={loading}
    />
  );
};

export default NewPasswordTemplate;
