import React from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';

export type InputProps = {
  register: UseFormRegister<any>;
  type?: React.HTMLInputTypeAttribute;
  options: RegisterOptions;
  name: string;
  autoComplete?: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
};

const Input: React.FC<InputProps> = ({
  register,
  type = 'text',
  name,
  options,
  autoComplete,
  label,
  disabled,
  placeholder,
}) => {
  return (
    <label htmlFor={name} className="pb-2">
      {/* LABEL */}
      <h4 className="pt-0 font-medium text-gray-600">{label}</h4>

      {/* INPUT */}
      <input
        id={name}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        className={
          type === 'checkbox'
            ? ''
            : 'w-full h-10 px-3 leading-tight text-gray-700 rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline'
        }
        {...register(name, options)}
        autoComplete={autoComplete}
      />
    </label>
  );
};
export default Input;
