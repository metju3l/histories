import { Menu, Transition } from '@headlessui/react';
import { FireIcon, TrendingUpIcon } from '@heroicons/react/outline';
import { ChevronLeftIcon } from '@heroicons/react/solid';
import { MapContext } from 'pages/map';
import React, { Fragment } from 'react';

import ArrowIcon from '../Icons/ArrowIcon';

type SubNavProps = {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
};

const SortByDropdown: React.FC<{
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}> = ({ sortBy, setSortBy }) => {
  const SortByItem: React.FC<{ name: string; icon: JSX.Element }> = ({
    name,
    icon,
  }) => (
    <Menu.Item
      as="button"
      className={`px-4 py-1.5 cursor-pointer hover:text-black flex items-center ${
        sortBy === name ? 'text-black' : 'text-gray-400'
      }`}
      onClick={() => setSortBy(name)}
    >
      {icon} {name}
    </Menu.Item>
  );

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center px-4 py-1 text-gray-500 border border-gray-200 min-w-24 hover:text-black hover:border-gray-400 rounded-xl">
        Sort by: {sortBy}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="div"
          className="absolute left-0 z-50 flex flex-col w-full text-gray-500 bg-white border border-gray-200 shadow-md top-10 min-w-24 rounded-xl divide-y"
        >
          <SortByItem
            name="Newest"
            icon={<ChevronLeftIcon className="w-5 h-5 mr-1 rotate-90" />}
          />
          <SortByItem
            name="Oldest"
            icon={<ChevronLeftIcon className="w-5 h-5 mr-1 -rotate-90" />}
          />
          <SortByItem name="Hot" icon={<FireIcon className="w-5 h-5 mr-1" />} />
          <SortByItem
            name="Trending"
            icon={<TrendingUpIcon className="w-5 h-5 mr-1" />}
          />
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const SubNav: React.FC<SubNavProps> = ({ sortBy, setSortBy }) => {
  const mapContext = React.useContext(MapContext);

  return (
    <div className="flex items-center justify-between w-full px-4 py-4 bg-white border-b border-gray-200 shadow-sm">
      <SortByDropdown sortBy={sortBy} setSortBy={setSortBy} />
      <div className="flex gap-2">
        {mapContext.sidebarPlace ? (
          <>
            <button onClick={() => mapContext.setSidebarPlace(null)}>
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
                mapContext.whatToShow !== 'photos'
                  ? 'text-black border-gray-400'
                  : 'text-gray-500'
              } rounded-xl`}
              onClick={() => mapContext.setWhatToShow('places')}
            >
              Places
            </button>
            <button
              className={`py-1 w-24 border border-gray-200 hover:text-black hover:border-gray-400 ${
                mapContext.whatToShow === 'photos'
                  ? 'text-black border-gray-400'
                  : 'text-gray-500'
              } rounded-xl`}
              onClick={() => mapContext.setWhatToShow('photos')}
            >
              Photos
            </button>
          </>
        )}
      </div>
      <span />
    </div>
  );
};

export default SubNav;
