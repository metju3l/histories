import React from 'react';

import { Loading } from '../Loading';

export type ButtonProps = {
  isLoading: boolean;
  text: string;
  onClick?: () => void;
  colorClassname?: string;
  backgroundClassname?: string;
};

const Button: React.FC<ButtonProps> = ({
  isLoading,
  text,
  onClick,
  backgroundClassname,
}) => (
  <button
    type={isLoading ? 'button' : 'submit'}
    onClick={onClick !== undefined ? onClick : () => {}}
    className={`inline-flex items-center justify-center h-10 font-medium tracking-wide text-white  rounded-lg w-52 transition duration-200 ${
      backgroundClassname ?? `bg-gray-900 hover:bg-gray-800`
    }`}
  >
    {isLoading ? <Loading color="#FFF" size="lg" /> : text}
  </button>
);

export default Button;
