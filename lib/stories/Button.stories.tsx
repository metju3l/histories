import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import { Button, ButtonProps } from '../../components/Button';

// Component
const Component = {
  title: 'Button',
  component: Button,
};
export default Component;

const Page = (args: ButtonProps) => {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={true} />
      {/* @ts-ignore */}
      <Button {...args}>{args.text}</Button>
    </div>
  );
};

// Template
const Template: Story<ButtonProps> = (args) => <Page {...args} />;

// Examples
export const Primary = Template.bind({});
Primary.args = {
  text: 'Submit',
  isLoading: false,
};

export const Loading = Template.bind({});
Loading.args = {
  text: 'Submit',
  isLoading: true,
};
