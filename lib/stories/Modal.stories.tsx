import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';

import { Modal } from '../../components/Modules/Modal';

// Component
const Component = {
  title: 'Modal',
  component: Modal,
};
export default Component;

const Template: Story<{
  isOpen: boolean;
  title: string;
  loading: boolean;
  content: string;
}> = (args) => (
  <Modal {...args} setOpenState={() => {}}>
    <div className="flex flex-col justify-center h-64 m-auto">
      {args.content}
    </div>
  </Modal>
);

export const Default = Template.bind({});
Default.args = {
  title: 'Save to',
  content: 'Example',
  isOpen: true,
  loading: false,
};

export const Loading = Template.bind({});
Loading.args = {
  title: 'Save to',
  content: 'Example',
  isOpen: true,
  loading: true,
};
