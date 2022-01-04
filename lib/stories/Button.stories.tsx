import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import Button, { ButtonProps } from '../../components/Elements/Buttons/Button';

// Component
const Component = {
  title: 'Elements/Button',
  component: Button,
};
export default Component;

const Page = (args: ButtonProps) => {
  return (
    <div className="">
      <Toaster position="top-center" reverseOrder={true} />
      <Button {...args} style="primary_solid">
        Primary_solid
      </Button>
      <br />
      <br />
      <Button {...args} style="warning_solid">
        Warning_solid
      </Button>
      <br />
      <br />
      <Button {...args} style="danger_solid">
        Danger_solid
      </Button>
      <br />
      <br />
      <Button {...args} style="success_solid">
        Success_solid
      </Button>{' '}
      <br />
      <br />
      <Button {...args} style="primary_outline">
        Primary_outline
      </Button>
      <br />
      <br />
      <Button {...args} style="warning_outline">
        Warning_outline
      </Button>
      <br />
      <br />
      <Button {...args} style="danger_outline">
        Danger_outline
      </Button>
      <br />
      <br />
      <Button {...args} style="success_outline">
        Success_outline
      </Button>
    </div>
  );
};

// Template
const Template: Story<ButtonProps> = (args) => <Page {...args} />;

const ButtonTemplate: Story<ButtonProps> = (args) => (
  <section>
    <Button {...args} size="sm">
      {/* @ts-ignore */}
      {args.text}
    </Button>
    <br />
    <Button {...args} size="base">
      {/* @ts-ignore */}
      {args.text}
    </Button>
    <br />
    <Button {...args} size="md">
      {/* @ts-ignore */}
      {args.text}
    </Button>
    <br />
    <Button {...args} size="lg">
      {/* @ts-ignore */}
      {args.text}
    </Button>
    <br />
    <Button {...args} size="xl">
      {/* @ts-ignore */}
      {args.text}
    </Button>
  </section>
);

// Examples
export const Example = Template.bind({});
Example.args = {
  text: 'Submit',
  isLoading: false,
};

export const Primary = ButtonTemplate.bind({});
Primary.args = {
  style: 'primary_solid',
  text: 'Submit',
  isLoading: false,
};

export const Warning = ButtonTemplate.bind({});
Warning.args = {
  style: 'warning_solid',
  text: 'Submit',
  isLoading: false,
};

export const Danger = ButtonTemplate.bind({});
Danger.args = {
  style: 'danger_solid',
  text: 'Submit',
  isLoading: false,
};

export const Success = ButtonTemplate.bind({});
Success.args = {
  style: 'success_solid',
  text: 'Submit',
  isLoading: false,
};

export const PrimaryOutline = ButtonTemplate.bind({});
PrimaryOutline.args = {
  style: 'primary_outline',
  text: 'Submit',
  isLoading: false,
};

export const WarningOutline = ButtonTemplate.bind({});
WarningOutline.args = {
  style: 'warning_outline',
  text: 'Submit',
  isLoading: false,
};

export const DangerOutline = ButtonTemplate.bind({});
Danger.Outlineargs = {
  style: 'danger_outline',
  text: 'Submit',
  isLoading: false,
};

export const SuccessOutline = ButtonTemplate.bind({});
SuccessOutline.args = {
  style: 'success_outline',
  text: 'Submit',
  isLoading: false,
};
