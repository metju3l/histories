import React from 'react';
import { Dialog } from '@headlessui/react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  blur?: boolean;
  blurSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  additionalClassName?: string;
};

const ModalComponent: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  blurSize,
  blur,
  additionalClassName,
}) => {
  const blurClassName = blur
    ? `backdrop-filter ${
        blurSize ? `backdrop-blur-${blurSize}` : 'backdrop-blur'
      }`
    : '';

  return (
    <Dialog open={open} onClose={onClose}>
      <section
        id="overlay"
        className={`absolute top-0 left-0 w-full h-full ${blurClassName} ${
          additionalClassName ?? ''
        }`}
        onClick={onClose}
      />
      {children}
    </Dialog>
  );
};
export default ModalComponent;
