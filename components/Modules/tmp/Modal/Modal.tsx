import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import { Loading } from '../../../Elements';

export type ModalProps = {
  isOpen: boolean;
  title: string;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
  loading?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  setOpenState,
  children,
  title,
  loading,
}) => {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: 'easeOut', duration: 0.2 }}
          className="fixed inset-0 z-10 flex items-center overflow-y-hidden bg-black bg-opacity-10"
          onClick={() => {} /* setOpenState(false) */}
        >
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ ease: 'easeInOut', duration: 0.2 }}
            className="absolute bottom-0 z-50 flex flex-col w-full overflow-hidden bg-white border shadow-2xl lg:m-auto lg:relative lg:max-w-4xl rounded-t-[2rem] lg:rounded-[2rem] max-h-[65vh] border-light-background-tertiary"
          >
            <div className="flex items-center justify-between p-6">
              <div className="text-lg font-semibold">{title}</div>
              <button onClick={() => setOpenState(false)}>close</button>
            </div>
            {loading ? (
              <div className="flex flex-col justify-center h-64 m-auto">
                <Loading color="#000000" size="xl" />
              </div>
            ) : (
              <> {children}</>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Modal;
