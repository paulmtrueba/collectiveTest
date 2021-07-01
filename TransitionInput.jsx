import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import ClickOutHandler from 'react-onclickout';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import { Input } from 'semantic-ui-react';

const namesArray = [
  'home_address',
  'business_address',
  'home_aptunit',
  'business_aptunit',
];
/**
 * @example
 *   <TransitionInput name="separate_business_bank_account" boolean />
 *   <TransitionInput name="employee_multiple_states" />
 *   <TransitionInput name="banking_notes" notes />
 *   <TransitionInput clientInfo name="home_state" />
 *   <TransitionInput clientInfo name="home_address" placesInput />
 *   <TransitionInput name="permanent_file" link />
 *   <TransitionInput name="expected_expenses" dollar />
 *   {this.store.transactionInfo.children_dob_list.map((child, index) => (
 *     <div key={child}>
 *       <TransitionInput name="children_fullname_list" index={index + 1} />
 *       <TransitionInput name="children_dob_list" index={index + 1} />
 *     </div>
 *   ))}
 */
@inject('OnboardHykeStore')
@observer
class TransitionInput extends Component {
    constructor(props) {
      super(props);
      this.store = props.OnboardHykeStore;
      this.state = {
        edit: false,
        hover: false,
        oldValue: '',
      };
    }

    cancelEdit = () => {
      const {
        index,
        name,
      } = this.props;
      const { transactionInfo } = this.store;
      const { oldValue } = this.state;

      if (index) {
        transactionInfo[name][index - 1] = oldValue;
      } else {
        transactionInfo[name] = oldValue;
      }
      this.setState({
        edit: false,
      });
    };

    convertToBoolean = (e) => {
      const { name } = this.props;
      const { transactionInfo } = this.store;
      const { value } = e.target;

      let returnValue = false;

      if (value === 'Yes') {
        returnValue = true;
      }

      if (value === 'Select an option') {
        returnValue = null;
      }

      transactionInfo[name] = returnValue;
    };

    enterEditMode = () => {
      const {
        index,
        name,
      } = this.props;
      const {
        transactionInfo,
      } = this.store;

      let newValue = transactionInfo[name][index - 1];
      if (!index) {
        newValue = transactionInfo[name]
      }
      if (!transactionInfo.approved) {
        this.setState({
          oldValue: newValue,
          edit: true,
        });
      }
    };

    handleAddressChanged = (address, newInfoHashString) => {
      const {
        clientInfo,
        index,
        name,
      } = this.props;
      const { transactionInfo: { approved } } = this.store;

      if (!approved) {
        if (index) {
          this.store[newInfoHashString][name][index - 1] = address;
        } else {
          this.store[newInfoHashString][name] = address;
        }
      }
    };

    handleAddressSelected = (address) => {
      const {
        handleParsedBusinessAddress,
        handleParsedHomeAddress,
      } = this.store;
      geocodeByAddress(address)
      .then((results) => {
        const { name } = this.props;

        if (name === 'business_address') {
          handleParsedBusinessAddress(results[0]);
          this.store.transitionClientInfo.updateBusinessAddress = true;
        } else if (name === 'home_address') {
          handleParsedHomeAddress(results[0]);
          this.store.transitionClientInfo.updateHomeAddress = true;
        }
      })
      .catch((error) => console.error('Error', error));
    };

    handleInputChange = (e, newInfoHashString) => {
      const {
        clientInfo,
        index,
        name,
      } = this.props;
      const { transactionInfo: { approved } } = this.store;
      const { value } = e.target;

      if (!approved) {
        if (index) {
          this.store[newInfoHashString][name][index - 1] = value;
        } else {
          this.store[newInfoHashString][name] = value;
        }
      }
    };

    handleSetSelectValue = (newInfoHashString) => {
      const {
        clientInfo,
        name,
        value,
      } = this.props;

      if (value) return value;
      switch(this.store[newInfoHashString][name]) {
        case 'true':
          return 'Yes';
        case 'false':
          return 'No';
        default:
          return 'Select an option';
      }
    }

    handleSetSpanValue = (newInfoHashString) => {
      const {
        boolean,
        dollar,
        index,
        name,
      } = this.props;

      if (boolean) return this.handleSetSelectValue(newInfoHashString);
      if (index) return this.store[newInfoHashString][name][index - 1];
      return `${dollar ? '$' : ''}${this.store[newInfoHashString][name]}`;
    }

    saveEdit = (removeBtn) => {
      const {
        clientInfo,
        name,
      } = this.props;
      const {
        transactionClientId,
        transactionInfo,
        getTransitionPlanPotentialSavings,
        updateClientInfo,
        updateTransactionInfo,
      } = this.store;

      if (clientInfo) {
        if (namesArray.includes(name)) {
          updateClientInfo(name);
        }
      } else if (!transactionInfo.approved) {
        if (name.includes('advised_salary')) {
          const newName = Math.round(transactionInfo[name] / 1000) * 1000;
          transactionInfo[name] = newName;
          getTransitionPlanPotentialSavings();
        }
        updateTransactionInfo(transactionClientId);
      }

      if (removeBtn) {
        this.setState({
          edit: false,
          hover: false,
        });
      } else {
        this.setState({
          edit: false,
        });
      }
    };

    setHoverTrue = () => {
      const { clientInfo } = this.props;
      const { transactionInfo } = this.store;

      if (clientInfo || !transactionInfo.approved) {
        this.setState({
          hover: true
        });
      }
    };

    render() {
      const {
        boolean,
        clientInfo,
        dollar,
        index,
        link,
        name,
        notes,
        placesInput,
        value,
      } = this.props;
      const {} = this.store;
      const {
        edit,
        hover,
      } = this.state;

      const newInfoHashString = clientInfo ? 'transitionClientInfo' : 'transactionInfo';
      const valueBasedOnIndex = index
        ? this.store[newInfoHashString][name][index - 1]
        : this.store[newInfoHashString][name];

      return (
        <Fragment>
          {notes ? (
            <Fragment>
              <div
                onMouseEnter={this.setHoverTrue}
                onMouseLeave={() => this.setState({ hover: false })}
                className="transition-input transition-note"
              >
                <textarea
                  placeholder="Add a note about this section"
                  value={this.store.transactionInfo[name]}
                  onChange={e => this.handleInputChange(e, newInfoHashString)}
                />
                {hover && (
                  <div onClick={() => this.saveEdit(true)} className="transition-edit">
                    Save
                  </div>
                )}
              </div>
            </Fragment>
          ) : link ? (
            <Fragment>
              <div
                onMouseEnter={this.setHoverTrue}
                onMouseLeave={() => this.setState({ hover: false })}
                className="transition-input transition-note"
              >
                <a href={this.store.transactionInfo[name]}>
                  {this.store.transactionInfo[name]}
                </a>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div
                className="transition-input"
                onMouseEnter={this.setHoverTrue}
                onMouseLeave={() => this.setState({ hover: false })}
              >
                {edit && (
                  <ClickOutHandler onClickOut={this.cancelEdit}>
                    {boolean ? (
                      <select
                        onChange={e => this.convertToBoolean(e)}
                        value={this.handleSetSelectValue(newInfoHashString)}
                      >
                        <option>Select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    ) : placesInput ? (
                      <PlacesAutocomplete
                        value={valueBasedOnIndex}
                        onChange={this.handleAddressChanged(newInfoHashString)}
                        onSelect={this.handleAddressSelected}
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
                              );
                            )}
                          </ul>
                        </div>
                      )}
                    </PlacesAutocomplete>
                  ) : (
                    <input
                      type={dollar ? 'number' : 'text'}
                      placeholder={placeholder}
                      value={valueBasedOnIndex}
                      onChange={e => this.handleInputChange(e, newInfoHashString)}
                    />
                  )}
                  {edit
                    && (
                      <div onClick={this.saveEdit} className="transition-edit">
                        Save
                      </div>
                  )}
                </ClickOutHandler>
              )}
              {!edit
                && (
                  <Fragment>
                    <span onClick={this.enterEditMode}>
                      {this.handleSetSpanValue(newInfoHashString)}
                    </span>
                    {hover
                      && (
                        <div onClick={this.enterEditMode} className="transition-edit">
                          Edit
                        </div>
                    )}
                  </Fragment>
                )}
              </div>
            </Fragment>
          )}
        </Fragment>
      );
    }
}

export default TransitionInput;
