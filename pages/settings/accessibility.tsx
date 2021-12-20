import SettingsLayout from '@components/Screens/Settings/SettingsLayout';
import { useTheme } from 'next-themes';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Account = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <SettingsLayout
      current="accessibility"
      title="accessibility"
      heading="accessibility"
      headingDescription=""
    >
      <h3 className="text-2xl font-medium">{t('language')}</h3>
      <div className="flex py-4 gap-6"></div>
    </SettingsLayout>
  );
};

export default Account;
