import { CheckboxElement } from '@components/Elements';
import SettingsLayout from '@components/Layouts/Settings';
import { useUpdateProfileMutation } from '@graphql/user.graphql';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { LoginContext } from '../_app';

const Account = () => {
  const { t } = useTranslation();

  const { data } = React.useContext(LoginContext);

  const [updateProfileMutation] = useUpdateProfileMutation();

  const notificationSettings = data?.me?.notificationSettings;

  return (
    <SettingsLayout
      current="notifications"
      heading="notifications"
      headingDescription=""
      head={{
        title: `${t('Notifications settings')} | hiStories`,
        description: `Notifications settings`,
        canonical: 'https://www.histories.cc/settings/notifications',
        openGraph: {
          title: `Notifications settings | hiStories`,
          type: 'website',
          url: 'https://www.histories.cc/settings/notifications',
          description: `Notifications settings`,
          site_name: 'Settings page',
        },
      }}
    >
      <h3 className="text-2xl font-medium">{t('email notifications')}</h3>
      <p className="pb-4 text-base text-gray-500"></p>
      <CheckboxElement
        title="New follower notifications"
        description="Get notification whenever someone follows you"
        args={{
          defaultChecked: notificationSettings?.newFollower,
          onClick: async (e) =>
            await updateProfileMutation({
              variables: {
                input: {
                  notificationSettings: {
                    newFollower: e.currentTarget.checked,
                  },
                },
              },
            }),
        }}
      />
      <CheckboxElement
        title="Post from people you follow"
        description="Get notification when some of people you follow creates new
        post"
        args={{
          defaultChecked: notificationSettings?.followingUserPost,
          onClick: async (e) =>
            await updateProfileMutation({
              variables: {
                input: {
                  notificationSettings: {
                    followingUserPost: e.currentTarget.checked,
                  },
                },
              },
            }),
        }}
      />
      <CheckboxElement
        title="Post in places you follow"
        description="Get notification when new post appends in places you follow"
        args={{
          defaultChecked: notificationSettings?.followingPlacePost,
          onClick: async (e) =>
            await updateProfileMutation({
              variables: {
                input: {
                  notificationSettings: {
                    followingPlacePost: e.currentTarget.checked,
                  },
                },
              },
            }),
        }}
      />
      <CheckboxElement
        title="HiStories newsletter"
        description="Get email newsletter with HiStories news"
        args={{
          defaultChecked: notificationSettings?.newsletter,
          onClick: async (e) =>
            await updateProfileMutation({
              variables: {
                input: {
                  notificationSettings: {
                    newsletter: e.currentTarget.checked,
                  },
                },
              },
            }),
        }}
      />
    </SettingsLayout>
  );
};

export default Account;
