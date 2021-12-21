import React from 'react';
import { useTranslation } from 'react-i18next';

import FirstLetterUppercase from '../../lib/functions/FirstLetterUppercase';

const CheckboxElement: React.FC<{
  title: string;
  description: string;
  args?: React.HTMLProps<HTMLInputElement>;
}> = ({ title, description, args }) => {
  const { t } = useTranslation();

  return (
    <label className="inline-flex pb-4">
      <input
        className="w-4 h-4 mt-1 text-green-500 border border-gray-300 mr-1.5 focus:ring-gray-400 focus:ring-opacity-25 rounded-md"
        type="checkbox"
        {...args}
      />
      <div className="flex flex-col">
        <div className="font-medium">{FirstLetterUppercase(t(title))}</div>
        <div>{t(description)}</div>
      </div>
    </label>
  );
};

export default CheckboxElement;
