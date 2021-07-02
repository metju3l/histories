import React from 'react';
import { ChangeEvent } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';
import { BiSearchAlt2 } from 'react-icons/bi';

const Search = () => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete();

  const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const handleSelect = (val: string): void => {
    setValue(val, false);
  };

  const renderSuggestions = (): JSX.Element => {
    const suggestions = data.map(({ place_id, description }: any) => (
      <ComboboxOption key={place_id} value={description} />
    ));

    return <>{suggestions}</>;
  };

  return (
    <div>
      <Combobox
        onSelect={handleSelect}
        className="w-full flex bg-white p-2 rounded-3xl"
      >
        <ComboboxInput
          className="w-11/12 rounded-md outline-none border-none inline-block  text-light-text"
          value={value}
          onChange={handleInput}
          disabled={!ready}
        />
        <ComboboxPopover className="w-full flex bg-white mt-2 px-2">
          <ComboboxList>{status === 'OK' && renderSuggestions()}</ComboboxList>
        </ComboboxPopover>
        <button type="submit" className="focus:outline-none inline-block ">
          <BiSearchAlt2 size={24} />
        </button>
      </Combobox>
    </div>
  );
};

export default Search;
