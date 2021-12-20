import SettingsLayout from '@components/Screens/Settings/SettingsLayout';
import { CheckboxElement } from '@components/UI';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Account = () => {
  const { t } = useTranslation();

  return (
    <SettingsLayout
      current="notifications"
      title="notifications"
      heading="notifications"
      headingDescription=""
    >
      <h3 className="text-2xl font-medium">{t('email notifications')}</h3>
      <p className="pb-4 text-base text-gray-500"></p>
      <CheckboxElement
        title="New follower notifications"
        description="Get notification whenever someone follows you"
      />
      <CheckboxElement
        title="Post from people you follow"
        description="Get notification when some of people you follow creates new
        post"
      />
      <CheckboxElement
        title="Post in places you follow"
        description="Get notification when new post appends in places you follow"
      />
      <CheckboxElement
        title="HiStories newsletter"
        description="Get email newsletter with HiStories news"
      />
    </SettingsLayout>
  );
};

export default Account;
