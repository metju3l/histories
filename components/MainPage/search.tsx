import React, { useEffect } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from '@reach/combobox';
import { BiSearchAlt2 } from 'react-icons/bi';

const PlacesAutocomplete = ({ setSearchCoordinates }: any) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete();

  const handleInput = (e: any) => {
    setValue(e.target.value);
  };

  const handleSelect = (val: string) => {
    setValue(val, false);

    getGeocode({ address: val })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setSearchCoordinates({ lat, lng });
      })
      .catch((error) => {
        console.log('😱 Error: ', error);
      });
  };

  return (
    <Combobox
      onSelect={handleSelect}
      aria-labelledby="demo"
      openOnFocus={true}
      className="w-[300px] bg-white py-2 px-4 rounded-3xl h-auto shadow"
    >
      <div className="flex w-full">
        <BiSearchAlt2 size={24} />
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          className="w-full rounded-sm outline-none border-none inline-block text-light-text"
        />
        <button
          onClick={() => {
            setValue('');
          }}
        >
          {' '}
          x
        </button>
      </div>
      <ComboboxPopover portal={false}>
        <ComboboxList className="w-full">
          {status === 'OK' &&
            data.map(({ place_id, description }) => (
              <ComboboxOption
                className="cursor-pointer"
                key={place_id}
                value={description}
                draggable={false}
              />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export default PlacesAutocomplete;
