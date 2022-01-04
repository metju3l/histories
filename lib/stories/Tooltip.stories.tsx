import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';

import Tooltip from '../../components/Elements/Tooltip';

// Component
const Component = {
  title: 'Elements/Tooltip',
  component: Tooltip,
};

export default Component;

// Template
const Template: Story = () => (
  <div className="block pt-8 pl-4 w-14">
    <Tooltip text="This account was created less than 2 days ago">
      <div className="items-center block px-3 py-1 text-xs font-semibold text-gray-500 bg-white border rounded-full space-x-1.5 dark:bg-gray-800 shadown-sm dark:border-gray-700 w-max">
        new user
      </div>
    </Tooltip>
  </div>
);

// Primary button
export const Default = Template.bind({});
Default.args = {
  size: 'sm',
  color: '#000',
};
