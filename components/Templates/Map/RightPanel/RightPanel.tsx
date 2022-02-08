import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { MapContext } from '../MapContext';
import { SubNav } from '../SubNav';
import Photos from './Photos';
import PlaceDetail from './PlaceDetail';
import Places from './Places';

const RightPanel: React.FC = () => {
  const mapContext = React.useContext(MapContext);

  const [sortBy, setSortBy] = useState('Hot');

  return (
    <div className="relative h-full">
      {mapContext.showSidebar && (
        <motion.div
          initial={{ opacity: 0, display: 'none' }}
          animate={{ opacity: 1, display: 'block' }}
          exit={{ opacity: 0, display: 'none' }}
          transition={{
            delay: mapContext.showSidebar ? 1 : 0,
            duration: 0.2,
            ease: 'easeInOut',
          }}
        >
          <SubNav sortBy={sortBy} setSortBy={setSortBy} />
          <div
            className={`p-4 pt-8 overflow-y-auto text-black dark:text-white ${
              mapContext.sidebarPlace
                ? ''
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-4'
            }`}
            style={{ height: 'calc(100vh - 123px)' }}
          >
            {mapContext.sidebarPlace ? (
              <PlaceDetail sidebarPlace={mapContext.sidebarPlace} />
            ) : mapContext.whatToShow === 'photos' ? (
              <Photos />
            ) : (
              <Places />
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RightPanel;
