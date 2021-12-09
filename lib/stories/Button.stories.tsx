import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import Button, { ButtonProps } from '../../components/UI/Button';

// Component
const Component = {
  title: 'Controls/Button',
  component: Button,
};
export default Component;

const Page = (args: ButtonProps) => {
  return (
    <div className="">
      <Toaster position="top-center" reverseOrder={true} />
      <Button {...args} type="primary">
        Primary
      </Button>
      <br />
      <br />
      <Button {...args} type="secondary">
        Secondary
      </Button>
      <br />
      <br />
      <Button {...args} type="danger">
        Danger
      </Button>
    </div>
  );
};

// Template
const Template: Story<ButtonProps> = (args) => <Page {...args} />;

const ButtonTemplate: Story<ButtonProps> = (args) => (
  // @ts-ignore
  <Button {...args}>{args.text}</Button>
);

// Examples
export const Example = Template.bind({});
Example.args = {
  text: 'Submit',
  isLoading: false,
};

export const Primary = ButtonTemplate.bind({});
Primary.args = {
  type: 'primary',
  text: 'Submit',
  isLoading: false,
};

export const Secondary = ButtonTemplate.bind({});
Secondary.args = {
  type: 'secondary',
  text: 'Submit',
  isLoading: false,
};

export const Danger = ButtonTemplate.bind({});
Danger.args = {
  type: 'danger',
  text: 'Submit',
  isLoading: false,
};

export const Loading = Template.bind({});
Loading.args = {
  text: 'Submit',
  isLoading: true,
};
