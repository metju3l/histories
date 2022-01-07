import { Input } from '@components/Elements';
import Button from '@components/Elements/Buttons/Button';
import NewPasswordFormInputs from '@lib/types/forms/newPasswordFormInputs';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type NewPasswordFormProps = {
  onSubmit: () => void;
  register: UseFormRegister<NewPasswordFormInputs>;
  loading: boolean;
};

const NewPasswordForm: React.FC<NewPasswordFormProps> = ({
  onSubmit,
  register,
  loading,
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <Input
        label={t('New password')}
        register={register}
        name="password"
        options={{ required: true, minLength: 8 }}
        autoComplete="new-password"
        type="password"
      />
      <Input
        label={t('Repeat new password')}
        register={register}
        name="repeatPassword"
        options={{ required: true, minLength: 8 }}
        autoComplete="new-password"
        type="password"
      />
      <Button style="primary_solid" loading={loading}>
        {t(loading ? 'loading' : 'Save new password')}
      </Button>
    </form>
  );
};

export default NewPasswordForm;
