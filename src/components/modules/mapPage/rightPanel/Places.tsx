import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import { MapContext } from '@src/contexts/MapContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

const Places: React.FC = () => {
  const mapContext = React.useContext(MapContext);

  return (
    <>
      {mapContext.placesQuery?.data?.places
        .filter(
          (place) =>
            place.years.filter(
              (year) =>
                year >= mapContext.timeLimitation[0] &&
                year <= mapContext.timeLimitation[1]
            ).length > 0
        )
        .filter(
          (place) =>
            place.latitude > mapContext.bounds.minLatitude &&
            place.latitude < mapContext.bounds.maxLatitude &&
            place.longitude > mapContext.bounds.minLongitude &&
            place.longitude < mapContext.bounds.maxLongitude &&
            place?.preview?.hash
        )
        .map(
          (place) =>
            place.preview && (
              <motion.div
                key={place.id}
                className={`flex flex-col w-full h-64 bg-white border border-gray-200 rounded-lg ${
                  mapContext.hoverPlaceId === place.id
                    ? 'border-black shadow-sm'
                    : ''
                }`}
                onClick={() => mapContext.setSidebarPlace(place.id)}
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
                  <h2 className="text-lg font-medium">{place?.name}</h2>
                  <h3 className="text-gray-600" style={{ fontSize: '12px' }}>
                    {place.description?.substring(0, 35)}...
                  </h3>
                </div>
              </motion.div>
            )
        ) ?? null}
    </>
  );
};

export default Places;
