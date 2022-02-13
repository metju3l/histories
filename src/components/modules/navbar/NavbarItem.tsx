import FirstLetterUppercase from '@src/functions/FirstLetterUppercase';
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
        className={`block font-medium dark:text-gray-200 px-4 py-2 rounded-lg transition ease-in-out text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 ${
          active ? 'bg-gray-100 dark:bg-gray-800' : ''
        }`}
      >
        {FirstLetterUppercase(t(text))}
      </a>
    </Link>
  );
};

export default NavbarItem;
