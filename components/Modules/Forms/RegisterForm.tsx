import { Button, Input } from '@components/Elements';
import GoogleAuthButton from '@components/Elements/buttons/GoogleAuth';
import RegisterFormInputs from '@lib/types/forms/registerFormInputs';
import Link from 'next/link';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type RegisterFormProps = {
  onSubmit: () => void;
  register: UseFormRegister<RegisterFormInputs>;
  loading: boolean;
};

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  register,
  loading,
}) => {
  const { t } = useTranslation(); // i18n

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          label={t('first_name')}
          register={register}
          name="firstName"
          options={{ required: true, maxLength: 50 }}
          autoComplete="given-name"
        />
        <Input
          label={t('last_name')}
          register={register}
          name="lastName"
          options={{ required: true, maxLength: 50 }}
          autoComplete="family-name"
        />
      </div>

      <Input
        label={t('username')}
        register={register}
        name="username"
        options={{ required: true, minLength: 3, maxLength: 50 }}
        autoComplete="username"
      />

      <Input
        label={t('email')}
        register={register}
        name="email"
        options={{ required: true }}
        autoComplete="email"
      />

      <Input
        label={t('password')}
        register={register}
        name="password"
        type="password"
        options={{ required: true, minLength: 8 }}
        autoComplete="new-password"
      />

      <Input
        label={t('repeat_password')}
        register={register}
        name="repeatPassword"
        type="password"
        options={{ required: true, minLength: 8 }}
        autoComplete="new-password"
      />

      <label className="inline-flex items-center mt-3">
        <input
          type="checkbox"
          className="w-5 h-5 text-orange-600 rounded-lg form-checkbox"
          {...register('notifications')}
        />
        <span className="ml-2 text-gray-700">
          {t('send_email_notifications')}
        </span>
      </label>

      <Button style="primary_solid" loading={loading}>
        {t(loading ? 'loading' : 'register')}
      </Button>

      <GoogleAuthButton text={t('google_register')} />
      <Link href="/login">
        <a className="pl-2 underline">{t('log_in_to_existing_account')}</a>
      </Link>
      <Link href="/forgot-password">
        <a className="pl-2 underline">{t('forgot_password')}</a>
      </Link>
    </form>
  );
};

export default RegisterForm;
