import { MapContext } from '@src/contexts/MapContext';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { HiOutlineChevronLeft } from 'react-icons/hi';

import { Map } from './map';
import RightPanel from './rightPanel/RightPanel';

const MapPageGrid: React.FC = () => {
  const mapContext = React.useContext(MapContext);

  return (
    <div
      className="w-full bg-[#FAFBFB] dark:bg-[#171716]"
      style={{ height: 'calc(100vh - 56px)' }}
    >
      <AnimatePresence>
        {/* MAIN GRID */}
        <motion.section
          initial={{
            gridTemplateColumns: '50% 50%',
          }}
          animate={{
            gridTemplateColumns: mapContext.showSidebar ? '50% 50%' : '100% 0%',
          }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={`w-full h-full grid grid-rows-1 ${''} `}
        >
          {/* LEFT PANEL */}
          <div className="relative w-full h-full p-2 col-span-2 md:col-span-1">
            {/* HIDE SIDEBAR ARROW ICON */}
            <button
              onClick={() => mapContext.setShowSidebar(!mapContext.showSidebar)}
              className="absolute z-40 flex items-center invisible h-8 py-1 text-gray-500 bg-white border border-gray-200 top-4 right-4 hover:text-black hover:border-gray-400 rounded-xl md:visible"
            >
              <HiOutlineChevronLeft
                className={`w-8 py-1 h-8 transition-all duration-500 ease-in-out ${
                  mapContext.showSidebar ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>
            {/* MAP */}
            <Map />
          </div>

          {/* RIGHT PANEL */}
          <RightPanel />
        </motion.section>
      </AnimatePresence>
    </div>
  );
};

export default MapPageGrid;
