import Link from 'next/link';
import React from 'react';

export type UserSubNavItemProps = {
  href: string;
  name: string;
  currentTab: string;
};

const UserSubNavItem: React.FC<UserSubNavItemProps> = ({
  children,
  href,
  name,
  currentTab,
}) => {
  return (
    <Link href={href}>
      <a
        className={`flex items-center px-3 py-1 font-bold ${
          currentTab === name
            ? 'bg-orange-100 text-brand dark:hover:bg-opacity-20 bg-opacity-100 text-brand-500'
            : 'hover:bg-orange-100 hover:text-brand dark:hover:bg-opacity-20 hover:bg-opacity-100 bg-brand-100 text-brand-500 text-gray-500'
        } rounded-lg gap-1 space-x-2`}
      >
        {children}
      </a>
    </Link>
  );
};

export default UserSubNavItem;
