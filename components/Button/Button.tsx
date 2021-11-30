import React from 'react';

import { Loading } from '../Loading';

export type ButtonProps = {
  isLoading: boolean;
  onClick?: () => void;
  type?: 'primary' | 'secondary' | 'danger';
};

const Button: React.FC<ButtonProps> = ({
  isLoading,
  children,
  onClick,
  type,
}) => (
  <button
    type={isLoading ? 'button' : 'submit'}
    onClick={onClick !== undefined ? onClick : () => {}}
    className={`inline-flex items-center justify-center h-10 min-w-[200px] font-medium tracking-wide text-white rounded-3xl px-4 ${
      type === 'primary'
        ? 'bg-gradient-to-r from-green-400 to-blue-500 border shadow-lg'
        : type === 'danger'
        ? 'bg-white border-[1.5px] border-red-400 text-red-500 hover:bg-red-100 shadow-lg'
        : 'bg-white border-[1.5px] border-gray-400 text-gray-700 hover:bg-gray-100 shadow-lg'
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
