import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';

import { Banner, BannerProps } from '../../components/Banner';

// Component
const Component = {
  title: 'Banner',
  component: Banner,
};
export default Component;

// Template
const Template: Story<BannerProps> = (args) => (
  <div>
    <Banner {...args} />
  </div>
);

// Examples
export const Primary = Template.bind({});
Primary.args = {
  text: 'Example',
};
