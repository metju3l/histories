import React from 'react';
import { useTranslation } from 'react-i18next';

const AccountTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="px-8">
      <h3 className="text-2xl font-medium">{t('delete account')}</h3>
      <p className="pb-4 text-base text-gray-500">
        This action cannot be taken back.
      </p>
      <button className="block px-4 py-1 font-medium text-red-600 bg-red-200 border border-red-200 rounded-md">
        {t('delete account')}
      </button>
    </div>
  );
};

export default AccountTab;
