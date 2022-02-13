import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { MapContext } from '@src/contexts/MapContext';
import Photos from './Photos';
import PlaceDetail from './PlaceDetail';
import Places from './Places';
import { SubNav } from './subNav';

const RightPanel: React.FC = () => {
  const mapContext = React.useContext(MapContext);

  const [sortBy, setSortBy] = useState('Hot');

  return mapContext.showSidebar ? (
    <motion.div
      className="relative w-full h-full overflow-y-auto bg-white"
      initial={{ opacity: 0, display: 'none' }}
      animate={{ opacity: 1, display: 'inline' }}
      exit={{ opacity: 0, display: 'none' }}
      transition={{
        delay: mapContext.showSidebar ? 1 : 0,
        duration: 0.2,
        ease: 'easeInOut',
      }}
    >
      <SubNav sortBy={sortBy} setSortBy={setSortBy} />
      <div /* this div is for posts to not have weird spacing between them on Y */
      >
        <div
          className={`p-4 pt-8 text-black dark:text-white ${
            mapContext.sidebarPlace
              ? ''
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-4 h-full'
          }`}
        >
          {mapContext.sidebarPlace ? (
            <PlaceDetail sidebarPlace={mapContext.sidebarPlace} />
          ) : mapContext.whatToShow === 'photos' ? (
            <Photos />
          ) : (
            <Places />
          )}
        </div>
      </div>
    </motion.div>
  ) : null;
};

export default RightPanel;
