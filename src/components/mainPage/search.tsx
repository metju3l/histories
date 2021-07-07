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
    const suggestions = data.map(
      ({
        place_id,
        description,
      }: {
        place_id: string;
        description: string;
      }) => <ComboboxOption key={place_id} value={description} />
    );

    return <>{suggestions}</>;
  };

  return (
    <div className="w-full">
      <Combobox
        onSelect={handleSelect}
        className="w-full flex bg-white p-2 rounded-lg bg-opacity-80"
      >
        <ComboboxInput
          className="w-11/12 rounded-sm bg-white bg-opacity-0 outline-none border-none inline-block text-light-text"
          value={value}
          onChange={handleInput}
          disabled={!ready}
        />
        <ComboboxPopover className="w-full flex bg-white bg-opacity-80 mt-2 px-2">
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
