import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';

import { LoginContext } from '../../components/Layout';
import { Navbar } from '../../components/Navbar';

// Component
const Component = {
  title: 'Navbar',
  component: Navbar,
};
export default Component;

// Template
const Template: Story = (args) => (
  <LoginContext.Provider
    value={{
      data: args,
      loading: false,
      error: undefined,
      refetch: undefined,
    }}
  >
    <div className="w-full h-screen m-0 p-0">
      <Navbar />
    </div>
  </LoginContext.Provider>
);

// Examples
export const Primary = Template.bind({});
Primary.args = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  email: 'johndoe@gmail.com',
  verified: true,
  collections: [
    {
      id: 1,
      name: 'Collection 1',
      description: 'Collection 1 description',
      createdAt: 1638605250347,
    },
  ],
};
