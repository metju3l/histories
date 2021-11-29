/*
import 'tailwindcss/tailwind.css';

import { Story } from '@storybook/react';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import {
  AddToCollectionModal,
  AddToCollectionModalProps,
} from '../../components/AddToCollectionModal';

// Component
const Component = {
  title: 'Add to collection modal',
  component: AddToCollectionModal,
  argTypes: {
    userCollections: {
      control: { type: 'object' },
    },
  },
};
export default Component;

const Page = (args: AddToCollectionModalProps) => {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={true} />
      <AddToCollectionModal {...args} />
    </div>
  );
};

// Template
const Template: Story<AddToCollectionModalProps> = (args) => <Page {...args} />;

// Primary button
export const Modal = Template.bind({});
Modal.args = {
  loading: false,
  isOpen: true,
  postId: 1,
  userCollections: [
    { id: 2, name: 'Phootos of Pepa' },
    { id: 4, name: 'Photos of kittens' },
  ],
  addToCollection: () => {},
  setOpenState: () => {},
};
*/
