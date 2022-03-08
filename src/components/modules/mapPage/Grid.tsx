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
      style={{ height: 'calc(100vh - 76px)' }}
    >
      <AnimatePresence>
        {/* MAIN GRID */}
        <motion.section
          className={`w-full h-full grid ${
            mapContext.showSidebar
              ? 'grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1'
              : 'grid-cols-1 grid-rows-1'
          } `}
        >
          {/* LEFT PANEL */}
          <div className="relative w-full h-full p-2 col-span-1">
            {/* HIDE SIDEBAR ARROW ICON */}
            <button
              onClick={() => mapContext.setShowSidebar(!mapContext.showSidebar)}
              className="absolute z-40 flex items-center h-8 py-1 text-gray-500 bg-white border border-gray-200 top-4 right-4 hover:text-black hover:border-gray-400 rounded-xl"
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
