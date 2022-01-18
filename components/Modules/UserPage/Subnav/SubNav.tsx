import React from 'react';
import { useTranslation } from 'react-i18next';

import { LoginContext } from '../../../../pages/_app';
import {
  BarsIcon,
  CollectionsIcon,
  GridIcon,
  MapIcon,
  PostsIcon,
  SettingsIcon,
} from '../../../icons';
import UserSubNavItem from './SubNavItem';

export type UserSubNavProps = {
  currentTab: string;
  user: { username: string; firstName: string; id: number };
  view: 'grid' | 'list';
  setView: React.Dispatch<React.SetStateAction<'grid' | 'list'>>;
};

const SubNav: React.FC<UserSubNavProps> = ({
  currentTab,
  user,
  view,
  setView,
}) => {
  // login context
  const loginContext = React.useContext(LoginContext);

  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between w-full px-2 pt-2 transition-all duration-500 ease-in-out">
      <div className="flex flex-col flex-wrap sm:flex-row sm:gap-3 gap-5">
        <UserSubNavItem
          href={`/user/${user.username}`}
          currentTab={currentTab}
          name="posts"
        >
          <PostsIcon />
          {t('posts')}
        </UserSubNavItem>
        <UserSubNavItem
          href={`/user/${user.username}/collections`}
          currentTab={currentTab}
          name="collections"
        >
          <CollectionsIcon className="w-4 h-4" />
          {t('collections')}
        </UserSubNavItem>
        <UserSubNavItem
          href={`/user/${user.username}/map`}
          currentTab={currentTab}
          name="map"
        >
          <MapIcon />
          {`${user.firstName}'s ${t('map')}`}
        </UserSubNavItem>
        {loginContext.data?.me?.id === user.id && (
          <UserSubNavItem
            href={`/settings`}
            currentTab={currentTab}
            name="settings"
          >
            <SettingsIcon />
            {t('settings')}
          </UserSubNavItem>
        )}
      </div>
      <div onClick={() => setView(view === 'list' ? 'grid' : 'list')}>
        {view === 'list' ? (
          <GridIcon className="w-4 h-4" />
        ) : (
          <BarsIcon className="w-4 h-4" />
        )}
      </div>
    </div>
  );
};

export default SubNav;
