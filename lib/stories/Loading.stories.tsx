import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';

import Loading, { LoadingProps } from '../../components/UI/Loading';

// Component
const Component = {
  title: 'Loading',
  component: Loading,
  argTypes: {
    size: {
      options: ['sm', 'base', 'lg', 'xl'],
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
