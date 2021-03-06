import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ClickOutHandler from 'react-onclickout';
import PlacesAutocomplete from 'react-places-autocomplete';
import { Input } from 'semantic-ui-react';

// created display component to break up the jsx in the parent container, legibility
// destructuring and formatting for legibility
// propTypes declarations for type checking, future proofing
// added displayName for unit testing identification, unit testing
// not happy with the leftover ternary but it's just the one in here so it's much more legible
// it seems to be much easier to eyeball how the logic is working from within the component
// moved specific imports to this component out of parent, separation of concerns
// removed React.Fragment since render elements are surrounded by one parent div, legibility
// switched all event listeners over to call arrow functions to prevent class methods from being called on instanciation

const DefaultComponent = ({
  boolean,
  dollar,
  edit,
  hover,
  placeholder,
  placesInput,
  newInfoHashString,
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
            value={() => handleSetSelectValue(newInfoHashString)}
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
                {suggestions.map((suggestion, key) => {
                  const suggestionClassName = suggestion.active ? 'is-active' : null;
                  return (
                    <li
                      key={key}
                      {...getSuggestionItemProps(suggestion, { suggestionClassName })}
                    >
                      <span>{suggestion.description}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </PlacesAutocomplete>
      ) : (
        <input
          type={dollar ? 'number' : 'text'}
          placeholder={placeholder}
          value={() => valueBasedOnIndex()}
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
    bool,
    func,
    string,
  } = PropTypes;

  DefaultComponent.propTypes = {
    boolean: bool.isRequired,
    dollar: bool.isRequired,
    edit: bool.isRequired,
    hover: bool.isRequired,
    placeholder: string.isRequired,
    placesInput: bool.isRequired,
    newInfoHashString: string.isRequired,
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
