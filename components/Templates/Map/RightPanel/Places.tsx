import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

import UrlPrefix from '../../../../shared/config/UrlPrefix';
import { MapContext } from '../MapContext';

const Places: React.FC = () => {
  const mapContext = React.useContext(MapContext);

  return (
    <>
      {mapContext.filteredPlaces
        .filter(
          (place) =>
            place?.preview?.hash &&
            place?.preview?.blurhash &&
            place?.preview?.height &&
            place?.preview?.width
        )
        .map(
          (place) =>
            place.preview && (
              <motion.div
                className={`flex flex-col w-full h-64 bg-white border border-gray-200 rounded-lg ${
                  mapContext.hoverPlaceId === place.id
                    ? 'border-black shadow-sm'
                    : ''
                }`}
                onClick={() => mapContext.setSidebarPlace(place)}
                onMouseEnter={() => mapContext.setHoverPlaceId(place.id)}
                onMouseLeave={() => mapContext.setHoverPlaceId(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}
              >
                {place.preview && (
                  <div className="relative w-full h-full rounded-t-lg cursor-pointer bg-secondary">
                    <Image
                      src={UrlPrefix + place.preview.hash}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                      className="rounded-t-lg"
                      alt="Profile picture"
                    />
                  </div>
                )}
                <div className="px-4 py-2">
                  <h2 className="text-lg font-medium">{place.name}</h2>
                  <h3 className="text-gray-600" style={{ fontSize: '12px' }}>
                    {place.description?.substring(0, 35)}...
                  </h3>
                </div>
              </motion.div>
            )
        ) ?? <></>}
    </>
  );
};

export default Places;
