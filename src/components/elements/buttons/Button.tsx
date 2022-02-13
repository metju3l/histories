import React from 'react';

import { Loading } from '..';

export type Styles =
  | 'primary_solid'
  | 'warning_solid'
  | 'danger_solid'
  | 'success_solid'
  | 'primary_outline'
  | 'warning_outline'
  | 'danger_outline'
  | 'success_outline';

type Sizes = 'sm' | 'base' | 'md' | 'lg' | 'xl';

export type ButtonProps = {
  loading?: boolean;
  style?: Styles;
  size?: Sizes;
  args?: any;
  className?: string;
  onClick?: () => void;
};

export const ButtonStyles = {
  primary_solid:
    'bg-gray-900 hover:bg-black border border-black text-white focus:ring-black rounded-xl',
  warning_solid:
    'bg-orange-500 hover:bg-orange-600 border border-orange-600 text-white focus:ring-orange-600 rounded-xl',
  danger_solid:
    'bg-red-500 hover:bg-red-600 border border-red-600 text-white focus:ring-red-400 rounded-xl',
  success_solid:
    'bg-green-500 hover:bg-green-600 border border-green-600 text-white focus:ring-green-400 rounded-xl',
  primary_outline:
    'border border-gray-900 text-gray-900 hover:bg-gray-100 focus:ring-gray-400 rounded-xl',
  warning_outline:
    'border border-orange-500 text-orange-500 hover:bg-orange-100 focus:ring-orange-400 rounded-xl',
  danger_outline:
    'border border-red-500 text-red-500 hover:bg-red-100 focus:ring-red-400 rounded-xl',
  success_outline:
    'border border-green-500 text-green-500 hover:bg-green-100 focus:ring-green-400 rounded-xl',
};

export const ButtonSizes = {
  sm: 'px-2 py-1 ',
  base: 'px-4 py-2',
  md: 'px-6 py-3',
  lg: 'px-8 py-4',
  xl: 'px-10 py-5',
};

const Button: React.FC<ButtonProps> = ({
  loading,
  style,
  size,
  args,
  children,
  className,
  onClick,
}) => (
  <button
    {...args}
    onClick={onClick}
    type={loading ? 'button' : 'submit'}
    className={
      'block ' +
        ButtonStyles[style ?? 'primary_solid'] +
        ' ' +
        ButtonSizes[size ?? 'base'] +
        ' ' +
        className ?? ''
    }
  >
    {loading ? (
      <Loading
        color={
          style === 'primary_solid'
            ? '#FFF'
            : style === 'danger_solid'
            ? '#f00'
            : '#444'
        }
        size="base"
      />
    ) : (
      children
    )}
  </button>
);

export default Button;
