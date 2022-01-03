import React from 'react';

import { LoginContext } from '../../../../pages/_app';
import { CollectionsIcon, MapIcon, PostsIcon, SettingsIcon } from './icons';
import UserSubNavItem from './SubNavItem';

export type UserSubNavProps = {
  currentTab: string;
  user: { username: string; firstName: string; id: number };
};

const SubNav: React.FC<UserSubNavProps> = ({ currentTab, user }) => {
  // login context
  const loginContext = React.useContext(LoginContext);

  return (
    <div className="flex w-full px-2 pt-2 pb-6 gap-3">
      <UserSubNavItem
        href={`/user/${user.username}`}
        currentTab={currentTab}
        name="posts"
      >
        <PostsIcon />
        Posts
      </UserSubNavItem>
      <UserSubNavItem
        href={`/user/${user.username}/collections`}
        currentTab={currentTab}
        name="collections"
      >
        <CollectionsIcon />
        Collections
      </UserSubNavItem>
      <UserSubNavItem
        href={`/user/${user.username}/map`}
        currentTab={currentTab}
        name="map"
      >
        <MapIcon />
        {`${user.firstName}'s map`}
      </UserSubNavItem>
      {loginContext.data?.me?.id === user.id && (
        <UserSubNavItem
          href={`/settings`}
          currentTab={currentTab}
          name="settings"
        >
          <SettingsIcon />
          Settings
        </UserSubNavItem>
      )}
    </div>
  );
};

export default SubNav;
