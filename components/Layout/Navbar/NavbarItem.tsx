import FirstLetterUppercase from '@lib/functions/FirstLetterUppercase';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

const NavbarItem: React.FC<{ text: string; href: string; active: boolean }> = ({
  text,
  href,
  active,
}) => {
  const { t } = useTranslation();

  return (
    <Link href={href}>
      <a
        className={`cursor-pointer py-2 px-4 border-b-4 border-transparent transition ease-in-out font-semibold ${
          active
            ? 'text-black border-black dark:text-gray-200 dark:border-gray-200'
            : 'text-gray-400 dark:text-gray-600 hover:border-gray-400 dark:hover:border-gray-600'
        }`}
      >
        {FirstLetterUppercase(t(text))}
      </a>
    </Link>
  );
};

export default NavbarItem;
