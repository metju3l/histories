import React from 'react';
import { useTranslation } from 'react-i18next';

const SubNavItem: React.FC<{
  title: string;
  current: string;
  setCurrent: React.Dispatch<React.SetStateAction<string>>;
}> = ({ title, current, setCurrent }) => {
  const { t } = useTranslation();

  return (
    <li>
      <button
        className={`flex py-2 px-4 rounded-md w-full ${
          current === title
            ? 'bg-gray-800 text-gray-50'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        onClick={() => setCurrent(title)}
      >
        {t(title)}
      </button>
    </li>
  );
};

export default SubNavItem;
