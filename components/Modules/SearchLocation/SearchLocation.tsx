import Viewport from '@lib/types/viewport';
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiSearch } from 'react-icons/hi';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

interface SearchLocationProps {
  viewport: Viewport;
  setViewport: React.Dispatch<React.SetStateAction<Viewport>>;
}

const SearchLocation: React.FC<SearchLocationProps> = ({
  viewport,
  setViewport,
}) => {
  const { t } = useTranslation<string>(); // i18n

  const [showList, setShowList] = useState<boolean>(false); // show list of results

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete(); // get suggestions from Google maps

  // on select
  function handleSelect(val: string) {
    setValue(val, false); // set value of the input field

    getGeocode({ address: val }) // get coordinates of the selected search result
      .then((results) => getLatLng(results[0])) // get coordinates
      .then(({ lat, lng }) =>
        setViewport({ ...viewport, latitude: lat, longitude: lng, zoom: 14 })
      ) // set coordinates
      .catch((error) => console.log('😱 Error: ', error)); // error handling
  }

  return (
    <Combobox
      onSelect={handleSelect}
      aria-labelledby="demo"
      openOnFocus={true}
      className="h-auto px-2 py-2 leading-tight text-gray-700 bg-white border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
    >
      <div className="flex w-full">
        {/* INPUT */}
        <ComboboxInput
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (!showList) setShowList(true);
            setValue(e.target.value);
          }} // on change
          onFocus={() => setShowList(true)}
          onBlur={() => setTimeout(() => setShowList(false), 200)} // without delay the list will be hidden before click is registered
          disabled={!ready} // disable input field if suggestions are not ready
          placeholder={t('search_place')} // placeholder text
          className="inline-block w-full px-2 font-medium placeholder-gray-400 border-none rounded-lg outline-none text-light-text"
        />
        {/* SEARCH ICON */}
        <button>
          <HiSearch className="w-8 h-8 text-gray-300" />
        </button>
      </div>
      {/* SEARCH RESULTS */}
      {showList && (
        <ComboboxPopover portal={false} onClick={() => setShowList(false)}>
          <ComboboxList className="w-full">
            {status === 'OK' &&
              data.map(({ place_id, description }) => (
                <ComboboxOption
                  className="px-2 py-1 rounded-lg cursor-pointer hover:bg-[#242526] hover:text-white"
                  key={place_id}
                  value={description}
                  draggable={false}
                />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      )}
    </Combobox>
  );
};

export default SearchLocation;
