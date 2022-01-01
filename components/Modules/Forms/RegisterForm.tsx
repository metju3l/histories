import { Button } from '@components/Elements';
import GoogleAuthButton from '@components/Elements/Buttons/GoogleAuth';
import RegisterFormInputs from '@lib/types/forms/registerFormInputs';
import Link from 'next/link';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';

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
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <input
        placeholder="First name"
        autoComplete="given-name"
        {...register('firstName', { required: true, maxLength: 50 })}
      />

      <input
        placeholder="Last name"
        autoComplete="family-name"
        {...register('lastName', { required: true, maxLength: 50 })}
      />
      <input
        placeholder="Username"
        autoComplete="username"
        {...register('username', {
          required: true,
          minLength: 3,
          maxLength: 32,
        })}
      />

      <input
        placeholder="Email"
        type="email"
        autoComplete="email"
        {...register('email', { required: true })}
      />

      <input
        placeholder="Password"
        type="password"
        autoComplete="new-password"
        {...register('password', { required: true, minLength: 8 })}
      />

      <input
        placeholder="Repeat password"
        type="password"
        autoComplete="new-password"
        {...register('repeatPassword', { required: true, minLength: 8 })}
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
        <Button isLoading={loading}>Sign up</Button>
      </div>
      <GoogleAuthButton />
      <Link href="/login">
        <a className="pl-2 underline">login to an existing account</a>
      </Link>
    </form>
  );
};

export default RegisterForm;
