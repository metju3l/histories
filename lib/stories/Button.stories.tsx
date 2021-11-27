import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';

import { Button, ButtonProps } from '../../components/Button';

// Component
const Component = {
  title: 'Button',
  component: Button,
};
export default Component;

// Template
const Template: Story<ButtonProps> = (args) => <Button {...args} />;

// Primary button
export const Primary = Template.bind({});
Primary.args = {
  text: 'Submit',
  isLoading: false,
};

// Loading button
export const Loading = Template.bind({});
Loading.args = {
  text: 'Submit',
  isLoading: true,
};
