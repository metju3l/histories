import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';

import Card from '../../components/Modules/UserPage/Card';
import { CollectionsIcon } from '../../components/Modules/UserPage/Subnav/icons';

// Component
const Component = {
  title: 'User/Card',
  component: Card,
  argTypes: {
    text: {
      control: { type: 'text' },
    },
  },
};

export default Component;

// Template
// eslint-disable-next-line react/prop-types
const TemplatePosts: Story<{ text: string }> = ({ text }) => (
  <Card>
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
        className="w-8 h-8 text-brand-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        ></path>
      </svg>
    </div>
    <div>{text}</div>
  </Card>
);

// eslint-disable-next-line react/prop-types
const TemplateCollections: Story<{ text: string }> = ({ text }) => (
  <Card>
    <CollectionsIcon className="w-8 h-8" />
    <div>{text}</div>
  </Card>
);

export const DoesNotHavePosts = TemplatePosts.bind({});
DoesNotHavePosts.args = {
  text: "John doesn't have any posts yet",
};

export const DoesNotHaveCollections = TemplateCollections.bind({});
DoesNotHaveCollections.args = {
  text: "John doesn't have any collections yet",
};
