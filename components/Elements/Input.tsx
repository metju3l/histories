import React from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';

export type InputProps = {
  register: UseFormRegister<any>;
  type?: React.HTMLInputTypeAttribute;
  options: RegisterOptions;
  name: string;
  autoComplete?: string;
  label?: string;
};

const Input: React.FC<InputProps> = ({
  register,
  type,
  name,
  options,
  autoComplete,
  label,
}) => {
  return (
    <label htmlFor={name}>
      {/* LABEL */}
      <h4 className="pt-0 pb-2 font-medium text-gray-600">{label}</h4>

      {/* INPUT */}
      <input
        id={name}
        type={type}
        className="w-full h-10 px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
        {...register(name, options)}
        autoComplete={autoComplete}
      />
    </label>
  );
};
export default Input;
