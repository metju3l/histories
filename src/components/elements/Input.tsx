import React, { useEffect, useState } from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

export type InputProps = {
  register: UseFormRegister<any>;
  type?: React.HTMLInputTypeAttribute;
  options?: RegisterOptions;
  name: string;
  autoComplete?: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  inputProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
};

const Input: React.FC<InputProps> = ({
  register,
  type = 'text',
  name,
  options = {},
  autoComplete,
  label,
  disabled,
  placeholder,
  inputProps = {},
  leftIcon,
  rightIcon,
  error,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [hasRightIcon, setHasRightIcon] = useState<boolean>(
    type === 'password' ? true : rightIcon !== undefined
  );
  const hasLeftIcon = leftIcon !== undefined;

  // to avoid too complicated and unreadable ifs in classNames
  useEffect(() => {
    setHasRightIcon(type === 'password' ? true : rightIcon !== undefined);
  }, [showPassword]);

  return (
    <div className="">
      {/* LABEL */}
      <label
        htmlFor={name}
        className={error === undefined ? 'formInputLabel' : 'text-red-500'}
      >
        {label}
      </label>

      <div className="relative text-gray-700">
        {/* LEFT ICON */}
        {hasLeftIcon && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            {leftIcon}
          </span>
        )}
        {/* INPUT */}
        <input
          {...inputProps}
          id={name}
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          disabled={disabled}
          placeholder={placeholder}
          className={`${type === 'checkbox' ? '' : 'formInput'}
            ${error === undefined ? 'border-gray-300 ' : 'border-red-500'} ${
            hasLeftIcon ? 'pl-8' : ''
          } ${hasRightIcon ? 'pr-8' : ''}`}
          {...register(name, options)}
          autoComplete={autoComplete}
        />

        {/* RIGHT ICON */}
        {hasRightIcon && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            {type === 'password' ? (
              showPassword ? (
                <HiOutlineEyeOff onClick={() => setShowPassword(false)} />
              ) : (
                <HiOutlineEye onClick={() => setShowPassword(true)} />
              )
            ) : (
              rightIcon
            )}
          </span>
        )}
      </div>
      <span className="text-red-500"> {error}</span>
    </div>
  );
};
export default Input;
