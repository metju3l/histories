import { Menu } from '@headlessui/react';
import { IViewport, MapStyles } from '@lib/types/map';
import React from 'react';
import { BiLayer } from 'react-icons/bi';
import ReactMapGL from 'react-map-gl';

import { Dark, Light, Satellite } from '../../../../lib/constants/MapStyles';

interface IMapStyleMenu {
  viewport: IViewport;
  setMapStyle: React.Dispatch<React.SetStateAction<MapStyles>>;
}

const MapStyleMenu: React.FC<IMapStyleMenu> = ({ viewport, setMapStyle }) => {
  return (
    <Menu>
      <Menu.Button
        as="button"
        className="flex items-center h-8 py-1 text-gray-500 bg-white border border-gray-200 hover:text-black hover:border-gray-400 rounded-xl"
      >
        <BiLayer className="w-8 h-8 p-1 text-black rounded-lg" />
      </Menu.Button>
      <Menu.Items
        as="div"
        className="absolute right-0 z-50 flex flex-row p-2 bg-white border border-gray-200 rounded-lg gap-2 -mt-9 transform -translate-y-full dark:bg-gray-900 focus:outline-none dark:border-gray-800 truncated"
      >
        <button
          className="block w-20 h-20 rounded"
          onClick={() => setMapStyle('light')}
        >
          <ReactMapGL
            {...{
              ...viewport,
              zoom: viewport.zoom > 4 ? viewport.zoom - 4 : viewport.zoom,
            }}
            width="100%"
            height="100%"
            className="rounded-lg"
            mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} // MAPBOX API ACCESS TOKEN
            mapStyle={Light}
          />
        </button>
        <button className="block w-20 h-20" onClick={() => setMapStyle('dark')}>
          <ReactMapGL
            {...{
              ...viewport,
              zoom: viewport.zoom > 4 ? viewport.zoom - 4 : viewport.zoom,
            }}
            width="100%"
            height="100%"
            className="rounded-lg"
            mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} // MAPBOX API ACCESS TOKEN
            mapStyle={Dark}
          />
        </button>
        <button
          className="block w-20 h-20"
          onClick={() => setMapStyle('satellite')}
        >
          <ReactMapGL
            {...{
              ...viewport,
              zoom: viewport.zoom > 4 ? viewport.zoom - 4 : viewport.zoom,
            }}
            width="100%"
            height="100%"
            className="rounded-lg"
            mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} // MAPBOX API ACCESS TOKEN
            mapStyle={Satellite}
          />
        </button>
      </Menu.Items>
    </Menu>
  );
};

export default MapStyleMenu;
