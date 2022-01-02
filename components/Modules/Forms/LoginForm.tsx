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
      <div>
        <h4 className="pt-0 pb-2 font-medium text-gray-600">
          {t('username or email')}
        </h4>
        <input
          className="w-full px-2 text-gray-600 border border-gray-300 outline-none rounded-md focus:border-gray-500 py-1.5"
          type="text"
          {...register('login', { required: true })}
        />
      </div>
      <div>
        <h4 className="pt-0 pb-2 font-medium text-gray-600">{t('password')}</h4>
        <input
          className="w-full px-2 text-gray-600 border border-gray-300 outline-none rounded-md focus:border-gray-500 py-1.5"
          type="password"
          {...register('password', { required: true })}
        />
      </div>
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
