import React from 'react';

import { Loading } from './';

export type ButtonProps = {
  isLoading?: boolean;
  onClick?: () => void;
  type?: 'primary' | 'secondary' | 'danger';
};

const Button: React.FC<ButtonProps> = ({
  isLoading = false, // set default value to false
  children,
  onClick,
  type = 'secondary', // set default value to secondary
}) => (
  <button
    type={isLoading ? 'button' : 'submit'}
    onClick={onClick !== undefined ? onClick : () => {}}
    className={`inline-flex py-0.5 px-4 items-center justify-center h-full w-full font-medium tracking-wide text-white rounded-lg px-4 ${
      type === 'primary'
        ? 'bg-blue-600 border border-blue-600 hover:bg-blue-700 transition-all text-white shadow-lg'
        : type === 'danger'
        ? 'bg-white border border-red-400 text-red-500 hover:bg-red-100 shadow-lg'
        : 'bg-white border border-gray-400 text-gray-700 hover:bg-gray-100 shadow-lg'
    }`}
  >
    {isLoading ? (
      <Loading
        color={
          type === 'primary' ? '#FFF' : type === 'danger' ? '#f00' : '#444'
        }
        size="base"
      />
    ) : (
      children
    )}
  </button>
);

export default Button;
