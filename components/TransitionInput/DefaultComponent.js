import React from 'react';
import PropTypes from 'prop-types';
import ClickOutHandler from 'react-onclickout';
import PlacesAutocomplete from 'react-places-autocomplete';
import { Input } from 'semantic-ui-react';

const DefaultComponent = ({
  boolean,
  dollar,
  edit,
  hover,
  placeHolder,
  placesInput,
  valueBasedOnIndex,
  cancelEdit,
  convertToBoolean,
  enterEditMode,
  handleAddressChanged,
  handleAddressSelected,
  handleInputChange,
  handleSetSelectValue,
  handleSetSpanValue,
  handleSetState,
  saveEdit,
  setHoverTrue,
}) => (
  <div
    className="transition-input"
    onMouseEnter={() => setHoverTrue()}
    onMouseLeave={() => handleSetState('hover', false)}
  >
    {edit && (
      <ClickOutHandler onClickOut={() => cancelEdit()}>
        {boolean ? (
          <select
            onChange={e => convertToBoolean(e)}
            value={handleSetSelectValue(newInfoHashString)}
          >
            <option>Select an option</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        ) : placesInput ? (
          <PlacesAutocomplete
            value={valueBasedOnIndex}
            onChange={() => handleAddressChanged(newInfoHashString)}
            onSelect={() => handleAddressSelected()}
          >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <div className="hyke-autocomplete">
              <Input
                {...getInputProps({placeholder: '', className: 'location-search-input'})}
              />
              <ul className="hyke-autocomplete__list">
                {suggestions.map((suggestion, key) => (
                  <li
                    key={key}
                    {...getSuggestionItemProps(suggestion, {suggestion.active ? 'is-active' : null})}
                  >
                    <span>{suggestion.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </PlacesAutocomplete>
      ) : (
        <input
          type={dollar ? 'number' : 'text'}
          placeholder={placeholder}
          value={valueBasedOnIndex}
          onChange={e => handleInputChange(e, newInfoHashString)}
        />
      )}
      {edit
        && (
          <div onClick={() => saveEdit()} className="transition-edit">
            Save
          </div>
        )}
      </ClickOutHandler>
    )}
    {!edit
      && (
      <Fragment>
        <span onClick={() => enterEditMode()}>
          {handleSetSpanValue(newInfoHashString)}
        </span>
        {hover
          && (
            <div onClick={() => enterEditMode()} className="transition-edit">
              Edit
            </div>
        )}
      </Fragment>
    )}
  </div>
);

{
  const {
    func,
    shape,
    string,
  } = PropTypes;

  DefaultComponent.propTypes = {
    boolean: boolean.isRequired,
    dollar: string.isRequired,
    edit: boolean.isRequired,
    hover: boolean.isRequired,
    placeHolder: string.isRequired,
    placesInput: boolean.isRequired,
    valueBasedOnIndex: string.isRequired,
    cancelEdit: func.isRequired,
    convertToBoolean: func.isRequired,
    enterEditMode: func.isRequired,
    handleAddressChanged: func.isRequired,
    handleAddressSelected: func.isRequired,
    handleInputChange: func.isRequired,
    handleSetSelectValue: func.isRequired,
    handleSetSpanValue: func.isRequired,
    handleSetState: func.isRequired,
    saveEdit: func.isRequired,
    setHoverTrue: func.isRequired,
  };
}

DefaultComponent.defaultProps = {};

DefaultComponent.displayName = 'DefaultComponent';

export default DefaultComponent;
