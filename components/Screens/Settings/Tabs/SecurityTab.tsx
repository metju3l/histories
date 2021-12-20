import React from 'react';
import { useTranslation } from 'react-i18next';

const SecurityTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="px-8">
      <h3 className="text-2xl font-medium">{t('password')}</h3>
      <p className="pb-4 text-base text-gray-500">
        Here you can change your password
      </p>
      <button className="block px-4 py-1 font-medium text-gray-600 bg-gray-200 border border-gray-200 rounded-md hover:bg-gray-300">
        {t('change password')}
      </button>
    </div>
  );
};

export default SecurityTab;
