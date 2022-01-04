import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';

import UserHasNoPostsYet, {
  UserHasNoPostsYetProps,
} from '../../components/Modules/UserPage/UserHasNoPostsYet';

// Component
const Component = {
  title: 'User/User has no posts yet card',
  component: UserHasNoPostsYet,
  argTypes: {
    firstName: {
      control: { type: 'text' },
    },
  },
};

export default Component;

// Template
const Template: Story<UserHasNoPostsYetProps> = (args) => (
  <UserHasNoPostsYet {...args} />
);

export const Default = Template.bind({});
Default.args = {
  firstName: 'John',
};
