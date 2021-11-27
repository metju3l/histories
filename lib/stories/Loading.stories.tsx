import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';
import { Loading, LoadingProps } from '../../components/Loading';

enum sizes {
  'sm' = 14,
  'base' = 16,
  'lg' = 20,
  'xl' = 24,
}

// Component
const Component = {
  title: 'Loading',
  component: Loading,
  argTypes: {
    size: {
      // get enum options
      options: Object.keys(sizes).filter((x) => isNaN(Number(x))),
      control: { type: 'radio' },
    },
    color: {
      control: { type: 'color' },
    },
  },
};

export default Component;

// Template
const Template: Story<LoadingProps> = (args) => <Loading {...args} />;

// Primary button
export const Default = Template.bind({});
Default.args = {
  size: 'sm',
  color: '#000',
};
