import { Input } from '@components/Elements';
import Button from '@components/Elements/Buttons/Button';
import GoogleAuthButton from '@components/Elements/Buttons/GoogleAuth';
import LoginFormInputs from '@lib/types/forms/loginFormInputs';
import Link from 'next/link';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type LoginFormProps = {
  onSubmit: () => void;
  register: UseFormRegister<LoginFormInputs>;
  loading: boolean;
};

const LoginForm: React.FC<LoginFormProps> = ({
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
      <Input
        label={t('password')}
        type="password"
        register={register}
        name="password"
        options={{ required: true }}
        autoComplete="password"
      />
      <Button style="primary_solid" loading={loading}>
        {t(loading ? 'loading' : 'login')}
      </Button>

      <GoogleAuthButton />
      <Link href="/register">
        <a className="pl-2 underline">{t('create new account')}</a>
      </Link>
    </form>
  );
};

export default LoginForm;
