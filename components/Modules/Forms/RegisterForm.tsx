import { Button, Input } from '@components/Elements';
import GoogleAuthButton from '@components/Elements/Buttons/GoogleAuth';
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
      <Input
        label="First name"
        register={register}
        name="firstName"
        options={{ required: true, maxLength: 50 }}
        autoComplete="given-name"
      />

      <Input
        label="Last name"
        register={register}
        name="lastName"
        options={{ required: true, maxLength: 50 }}
        autoComplete="family-name"
      />

      <Input
        label="username"
        register={register}
        name="username"
        options={{ required: true, minLength: 3, maxLength: 50 }}
        autoComplete="username"
      />

      <Input
        label="email"
        register={register}
        name="email"
        options={{ required: true }}
        autoComplete="email"
      />

      <Input
        label="password"
        register={register}
        name="password"
        type="password"
        options={{ required: true, minLength: 8 }}
        autoComplete="new-password"
      />

      <Input
        label="Repeat password"
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
        <span className="ml-2 text-gray-700">Send me email updates</span>
      </label>

      <div className="mt-2 mb-2">
        <Button loading={loading}>Sign up</Button>
      </div>
      <GoogleAuthButton text={t('register')} />
      <Link href="/login">
        <a className="pl-2 underline">login to an existing account</a>
      </Link>
      <Link href="/forgot-password">
        <a className="pl-2 underline">{t('forgot password')}</a>
      </Link>
    </form>
  );
};

export default RegisterForm;
