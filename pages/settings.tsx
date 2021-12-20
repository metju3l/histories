import { Layout } from '@components/Layout';
import SubNavItem from '@components/Screens/Settings/SubNavItem';
import AccountTab from '@components/Screens/Settings/Tabs/AccountTab';
import SecurityTab from '@components/Screens/Settings/Tabs/SecurityTab';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Settings: NextPage = () => { 
  const { t } = useTranslation();
  const [current, setCurrent] = useState('account');

  return (
    <Layout title="Settings" redirectNotLogged>
      <div className="w-full">
        <div className="w-full max-w-4xl px-6 m-auto xl:px-0">
          <div className="flex pt-6 pb-8">
            <div className="py-2">
              <h1 className="text-5xl font-bold tracking-tight">Account</h1>
              <h2 className="tracking-wide text-gray-500">
                {t('manage your account settings')}
              </h2>
            </div>
          </div>
          <div className="absolute left-0 w-full border-b border-gray-200 dark:border-gray-800"></div>

          <div className="flex w-full pt-12">
            <ul className="flex flex-col w-48 pt-4 tracking-wide text-gray-500 text lg:pt-0 space-y-2">
              <SubNavItem
                title="account"
                current={current}
                setCurrent={setCurrent}
              />
              <SubNavItem
                title="security"
                current={current}
                setCurrent={setCurrent}
              />
              <SubNavItem
                title="notifications"
                current={current}
                setCurrent={setCurrent}
              />
              <SubNavItem
                title="preferences"
                current={current}
                setCurrent={setCurrent}
              />
              <SubNavItem
                title="accessibility"
                current={current}
                setCurrent={setCurrent}
              />
            </ul>
            <div className="w-full h-full">
              {current === 'security' ? <SecurityTab /> : <AccountTab />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
