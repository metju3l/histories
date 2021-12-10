import React from 'react';

import ArrowIcon from '../Icons/ArrowIcon';

type SubNavProps = {
  setWhatToShow: React.Dispatch<React.SetStateAction<string | null>>;
  setSidebarPlace: React.Dispatch<
    React.SetStateAction<{
      id: number;
      name?: string | null | undefined;
      longitude: number;
      latitude: number;
      icon?: string | null | undefined;
      preview?: string[] | null | undefined;
    } | null>
  >;
  sidebarPlace: {
    id: number;
    name?: string | null | undefined;
    longitude: number;
    latitude: number;
    icon?: string | null | undefined;
    preview?: string[] | null | undefined;
  } | null;
  whatToShow: string | null;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const SubNav: React.FC<SubNavProps> = ({
  sidebarPlace,
  setSidebarPlace,
  whatToShow,
  setWhatToShow,
  setShowSidebar,
}) => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-4 bg-white border-b border-gray-200 shadow-sm">
      <span className="w-8" />

      <div className="flex gap-2">
        {sidebarPlace ? (
          <>
            <button onClick={() => setSidebarPlace(null)}>
              <ArrowIcon className="w-8 h-8 py-1 text-gray-500 border border-gray-200 hover:text-black hover:border-gray-400 rounded-xl" />
            </button>
            <div className="px-4 py-1 text-gray-600 border border-gray-200 min-w-24 rounded-xl">
              Place detail
            </div>
          </>
        ) : (
          <>
            <button
              className={`py-1 w-24 border border-gray-200 hover:text-black hover:border-gray-400 ${
                whatToShow !== 'photos'
                  ? 'text-black border-gray-400'
                  : 'text-gray-500'
              } rounded-xl`}
              onClick={() => setWhatToShow('places')}
            >
              Places
            </button>
            <button
              className={`py-1 w-24 border border-gray-200 hover:text-black hover:border-gray-400 ${
                whatToShow === 'photos'
                  ? 'text-black border-gray-400'
                  : 'text-gray-500'
              } rounded-xl`}
              onClick={() => setWhatToShow('photos')}
            >
              Photos
            </button>
          </>
        )}
      </div>
      <button onClick={() => setShowSidebar(false)}>
        <ArrowIcon className="w-8 h-8 py-1 text-gray-500 border border-gray-200 hover:text-black hover:border-gray-400 rounded-xl" />
      </button>
    </div>
  );
};

export default SubNav;
