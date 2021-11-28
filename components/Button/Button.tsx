import React from 'react';

import { Loading } from '../Loading';

export type ButtonProps = {
  isLoading: boolean;
  onClick?: () => void;
  colorClassname?: string;
  backgroundClassname?: string;
};

const Button: React.FC<ButtonProps> = ({
  isLoading,
  children,
  onClick,
  backgroundClassname,
}) => (
  <button
    type={isLoading ? 'button' : 'submit'}
    onClick={onClick !== undefined ? onClick : () => {}}
    className={`inline-flex items-center justify-center h-10 font-medium tracking-wide text-white  rounded-lg px-4 transition duration-200 ${
      backgroundClassname ?? `bg-gray-900 hover:bg-gray-800`
    }`}
  >
    {isLoading ? <Loading color="#FFF" size="lg" /> : children}
  </button>
);

export default Button;
