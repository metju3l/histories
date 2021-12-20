import SettingsLayout from '@components/Screens/Settings/SettingsLayout';
import { useTheme } from 'next-themes';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Account = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <SettingsLayout
      current="appearance"
      title="appearance"
      heading="appearance"
      headingDescription=""
    >
      <h3 className="text-2xl font-medium">{t('theme')}</h3>
      <div className="flex py-4 gap-6">
        <ThemeCard
          title="Light"
          onClick={() => setTheme('light')}
          active={theme === 'light'}
        >
          Sun icon tbd
        </ThemeCard>
        <ThemeCard
          title="Dark"
          onClick={() => setTheme('dark')}
          active={theme === 'dark'}
        >
          Moon icon tbd
        </ThemeCard>
        <ThemeCard
          title="System"
          onClick={() => setTheme('system')}
          active={theme === 'system'}
        >
          Computer icon tbd
        </ThemeCard>
      </div>
    </SettingsLayout>
  );
};

const ThemeCard: React.FC<{
  onClick: () => void;
  title: string;
  active: boolean;
}> = ({ children, title, onClick, active }) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col w-36 h-36 p-2 rounded-xl border-2 cursor-pointer transition-all ease-in-out duration-300 ${
        active
          ? 'text-green-500 border-green-500'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 text-gray-500 dark:text-gray-400'
      }`}
    >
      <a className="font-semibold">{title}</a>
      <div className="flex items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default Account;
