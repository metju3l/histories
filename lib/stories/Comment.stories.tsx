import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import { Comment, CommentProps } from '../../components/Comment';

/*

// Component
const Component = {
  title: 'Comment',
  component: Comment,
  argTypes: {
    createdAt: {
      control: { type: 'date' },
    },
  },
};
export default Component;

const Page = (args: CommentProps) => {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={true} />
      <Comment {...args} createdAt={new Date(args.createdAt).getTime()} />
    </div>
  );
};

// Template
const Template: Story<CommentProps> = (args) => <Page {...args} />;

// Examples
export const Default = Template.bind({});
Default.args = {
  content:
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis condimentum augue id magna semper rutrum. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Nunc tincidunt ante vitae massa.',
  createdAt: new Date().getTime(),
  author: {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
  },
  liked: false,
  owner: true,
  isLogged: true,
  onLike: () => {},
  deleteComment: () => {},
};

*/
