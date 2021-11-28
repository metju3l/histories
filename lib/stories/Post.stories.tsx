/*import 'tailwindcss/tailwind.css';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Story } from '@storybook/react';
import React from 'react';

import { Post, PostProps } from '../../components/Post';

// Component
const Component = {
  title: 'Post',
  component: Post,
  argTypes: {
    createdAt: {
      control: { type: 'date' },
    },
    postDate: {
      control: { type: 'date' },
    },
  },
};

export default Component;

// Template
const Template: Story<PostProps> = (args) => {
  const client = new ApolloClient({
    uri: 'http://localhost:3000/api/graphql',
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <div className="w-full h-screen">
        <Post {...args} />
      </div>
    </ApolloProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  author: { firstName: 'John', lastName: 'Doe', username: 'johndoe' },
  photos: [
    {
      url: 'https://histories-bucket.s3.eu-central-1.amazonaws.com/1636470710525-d4a29e87.jpg',
    },
  ],
  createdAt: new Date().getTime(),
  postDate: new Date().getTime(),

  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  likeCount: 22,
  commentCount: 18,
};

export const WithTimeline = Template.bind({});
WithTimeline.args = {
  author: { firstName: 'John', lastName: 'Doe', username: 'johndoe' },
  photos: [
    {
      url: 'https://histories-bucket.s3.eu-central-1.amazonaws.com/1636470710525-d4a29e87.jpg',
    },
  ],

  timeline: true,
  createdAt: new Date().getTime(),
  postDate: new Date().getTime(),

  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  likeCount: 22,
  commentCount: 18,
};

export const WithoutPhotos = Template.bind({});
WithoutPhotos.args = {
  author: { firstName: 'John', lastName: 'Doe', username: 'johndoe' },

  createdAt: new Date().getTime(),
  postDate: new Date().getTime(),

  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  likeCount: 22,
  commentCount: 18,
};

export const Liked = Template.bind({});
Liked.args = {
  author: { firstName: 'John', lastName: 'Doe', username: 'johndoe' },

  createdAt: new Date().getTime(),
  postDate: new Date().getTime(),

  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  likeCount: 22,
  commentCount: 18,
  liked: '❤',
};
*/
