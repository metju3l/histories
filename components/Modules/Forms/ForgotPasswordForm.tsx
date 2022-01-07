import { Input } from '@components/Elements';
import Button from '@components/Elements/Buttons/Button';
import ForgotPasswordFormInputs from '@lib/types/forms/forgotPasswordFormInputs';
import Link from 'next/link';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type ForgotPasswordFormProps = {
  onSubmit: () => void;
  register: UseFormRegister<ForgotPasswordFormInputs>;
  loading: boolean;
};

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  register,
  loading,
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <Input
        label={t('username or email')}
        register={register}
        name="login"
        options={{ required: true }}
        autoComplete="username"
      />
      <Button style="primary_solid" loading={loading}>
        {t(loading ? 'loading' : 'Send Password Reset Link')}
      </Button>

      <Link href="/register">
        <a className="pl-2 underline">{t('create new account')}</a>
      </Link>
      <Link href="/login">
        <a className="pl-2 underline">{t('log in')}</a>
      </Link>
    </form>
  );
};

export default ForgotPasswordForm;
