import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';

import { MiniUserCard, MiniUserCardProps } from '../../components/MiniUserCard';

// Component
const Component = {
  title: 'Mini user card',
  component: MiniUserCard,
  argTypes: {
    time: {
      control: { type: 'date' },
    },
  },
};

export default Component;

// Template
const Template: Story<MiniUserCardProps> = (args) => <MiniUserCard {...args} />;

// Primary button
export const Default = Template.bind({});
Default.args = {
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
};
