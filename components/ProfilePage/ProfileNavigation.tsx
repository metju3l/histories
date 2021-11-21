import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const ProfileNavigation: React.FC<{
  loggedQuery: any;
  userQuery: any;
}> = ({ loggedQuery, userQuery }) => {
  const router = useRouter();

  return (
    <div className="flex w-full h-auto pt-4 pb-8 gap-4">
      <MenuOption
        pathname={router.pathname}
        title="Posts"
        href={'/' + userQuery.data.user.username}
        path="[username]"
      />{' '}
      <MenuOption
        pathname={router.pathname}
        title="Collections"
        href={'/' + userQuery.data.user.username + '/collections'}
        path="collections"
      />{' '}
      <MenuOption
        pathname={router.pathname}
        title="Map"
        href="/map"
        path="map"
      />
      {loggedQuery.data?.isLogged?.id === userQuery.data.user.id && (
        <MenuOption
          pathname={router.pathname}
          title="Settings"
          href="/settings"
          path="settings"
        />
      )}
    </div>
  );
};

const MenuOption: React.FC<{
  title: string;
  path: string;
  href: string;
  pathname: string;
}> = ({ path, href, title, pathname }) => {
  return (
    <Link href={href} passHref>
      <button
        className={`px-6 py-2 text-gray-200 rounded-xl ${
          pathname.split('/')[pathname.split('/').length - 1] == path
            ? 'bg-[#484A4D]'
            : 'hover:bg-[#484A4D]'
        }`}
      >
        {title}
      </button>
    </Link>
  );
};

export default ProfileNavigation;
