import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

export type SubNavItemProps = {
  title: string;
  href: string;
  current: string;
};

const SubNavItem: React.FC<SubNavItemProps> = ({ title, href, current }) => {
  const { t } = useTranslation();

  return (
    <li>
      <Link href={href}>
        <a
          className={`flex py-2 px-4 rounded-md w-full font-medium ${
            current === title
              ? 'bg-[#45413C] text-white'
              : 'hover:bg-gray-100 dark:hover:bg-[#45413C] text-gray-600 dark:text-gray-400'
          }`}
        >
          {t(title)}
        </a>
      </Link>
    </li>
  );
};

export default SubNavItem;
