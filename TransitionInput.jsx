import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { geocodeByAddress } from 'react-places-autocomplete';

import NotesComponent from './components/TransitionInput/NotesComponent';
import LinkComponent from './components/TransitionInput/LinkComponent';
import DefaultComponent from './components/TransitionInput/DefaultComponent';

// broke names array out as global to make saveEdit function more readable, legibility
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
      // used to try to mock store for testing
      // this.store = {
      //   transactionClientId: '',
      //   transactionInfo: {},
      //   getTransitionPlanPotentialSavings: () => {},
      //   updateClientInfo: () => {},
      //   updateTransactionInfo: {},
      // }
      //formatting for legibility
      this.state = {
        edit: false,
        hover: false,
        oldValue: '',
      };
    }
    // alphabetized class methods for easier bugfixing, refactoring or additional coding in future, future proofing
    // reformatted everything down to one tab spacing, legibility
    // context assumption that index prop will never change for each page visit or else data type of
    // this.store.transactionInfo[name][index - 1] and this.store.transactionInfo[name] will be in conflict with
    // regards to the default value of state.oldValue since it would need to switch between a string and a collection or object
    // in order for existing logic to work properly

    cancelEdit = () => {
      // destructuring and formatting for legibility
      const {
        index,
        name,
      } = this.props;
      const { oldValue } = this.state;

      if (index) {
        this.store.transactionInfo[name][index - 1] = oldValue;
      } else {
        this.store.transactionInfo[name] = oldValue;
      }
      this.setState({
        edit: false,
      });
    };

    convertToBoolean = (e) => {
      // destructuring and refactor logic a bit for improved legibility
      // change out of habit from using eslint,
      // enclosed function params in parens because arrow function isn't implicit return, implied lint error fix
      // semantic changes, existing logic worked fine and was legible
      const { name } = this.props;
      const { value } = e.target;

      let returnValue = value === 'Yes';

      if (value === 'Select an option') returnValue = null;

      this.store.transactionInfo[name] = returnValue;
    };

    enterEditMode = () => {
      // destructuring and refactor logic a bit for improved legibility
      // removed ternary and replaced with let variable and a single conditional, legibility
      // created let to hold the value for setState instead of performing logic within that call, legibility
      const {
        index,
        name,
      } = this.props;
      const {
        transactionInfo,
      } = this.store;

      let newValue = transactionInfo[name];

      if (index) {
        newValue = transactionInfo[name][index - 1];
      }

      if (!transactionInfo.approved) {
        this.setState({
          oldValue: newValue,
          edit: true,
        });
      }
    };

    handleAddressChanged = (address, newInfoHashString) => {
      // destructuring for improved legibility
      // change out of habit from using eslint,
      // enclosed function params in parens because arrow function isn't implicit return, implied lint error fix
      // existing logic left unchanged, nested if could be changed but it makes the code a bit more confusing, left for legibility
      // passed in a param containing the old ternary's value, legibility
      const {
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
      // destructuring for improved legibility
      // change out of habit from using eslint,
      // enclosed function params in parens because arrow function isn't implicit return, implied lint error fix
      // destrucutred this.props.name within callback in case that value is subject to changes from the async call, order of operations
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
      // destructuring for improved legibility
      // change out of habit from using eslint,
      // enclosed function params in parens because arrow function isn't implicit return, implied lint error fix
      // existing logic left unchanged, nested if could be changed but it makes the code a bit more confusing, left for legibility
      // passed in a param containing an old ternary's value, legibility
      const {
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
      // created to break out several ternaries used to convert either this.props.value or a this.store value
      // into a value for a select option dropdown, reusability and legibility
      // passed in a param containing an old ternary's value, legibility
      const {
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
      // created to break out a complicated, nested ternary used to set the value of a span
      // passed in a param containing an old ternary's value, legibility
      // not a fan of single line if statements but they are pretty legible in this case
      const {
        boolean,
        dollar,
        index,
        name,
      } = this.props;

      let returnValue = `${dollar ? '$' : ''}${this.store[newInfoHashString][name]}`

      if (boolean) returnValue = this.handleSetSelectValue(newInfoHashString);

      if (index) returnValue = this.store[newInfoHashString][name][index - 1];

      return returnValue;
    }

    handleSetState = (key, value) => {
      // created to have a function that sets state for parent to pass through to child components
      this.setState({
        [key]: value,
      });
    }

    saveEdit = (removeBtn) => {
      // destructuring for improved legibility
      // change out of habit from using eslint,
      // enclosed function params in parens because arrow function isn't implicit return, implied lint error fix
      // there are a few minor things that could be refactored but that doesn't really solve anything
      // nested ifs and else if could be changed but it doesn't really improve on legibility at all
      // two setState calls aren't ideal and it could be one call with only the values being determined by conditional
      // but that is minor,
      // if more than two I would refactor to having conditional values passed to one setState
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
          this.store.transactionInfo[name] = newName;
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
      // destructuring for improved legibility
      const { clientInfo } = this.props;
      const { transactionInfo } = this.store;

      if (clientInfo || !transactionInfo.approved) {
        this.setState({
          hover: true
        });
      }
    };

    render() {
      // destructuring for improved legibility
      // created a const for newInfoHashString that replaces a ternary duplicated multiple times
      // this const is passed into other class methods from here so that if it ever needs
      // to be changed a dev only needs change it once inside render and not multiple times inside each method, reusability and legibility
      // created a const for valueBasedOnIndex that replaces a ternary duplicated twice in the DefaultComponent, reusability and legibility
      // broke out each section of jsx that was being rendered by ternary into components, legibility
      const {
        boolean,
        clientInfo,
        dollar,
        index,
        link,
        name,
        notes,
        placeholder,
        placesInput,
      } = this.props;
      const { transactionInfo } = this.store;
      const {
        edit,
        hover,
      } = this.state;

      const newInfoHashString = clientInfo ? 'transitionClientInfo' : 'transactionInfo';
      const valueBasedOnIndex = index
        ? this.store[newInfoHashString][name][index - 1]
        : this.store[newInfoHashString][name] || '';

      return (
        <Fragment>
          {notes ? (
            <NotesComponent
              hover={hover}
              name={name}
              newInfoHashString={newInfoHashString}
              transactionInfo={transactionInfo}
              handleInputChange={this.handleInputChange}
              handleSetState={this.handleSetState}
              saveEdit={this.saveEdit}
              setHoverTrue={this.setHoverTrue}
            />
          ) : link ? (
            <LinkComponent
              name={name}
              transactionInfo={transactionInfo}
              handleSetState={this.handleSetState}
              setHoverTrue={this.setHoverTrue}
            />
          ) : (
            <DefaultComponent
              boolean={boolean}
              dollar={dollar}
              edit={edit}
              hover={hover}
              placeholder={placeholder}
              placesInput={placesInput}
              newInfoHashString={newInfoHashString}
              valueBasedOnIndex={valueBasedOnIndex}
              cancelEdit={this.cancelEdit}
              convertToBoolean={this.convertToBoolean}
              enterEditMode={this.enterEditMode}
              handleAddressChanged={this.handleAddressChanged}
              handleAddressSelected={this.handleAddressSelected}
              handleInputChange={this.handleInputChange}
              handleSetSelectValue={this.handleSetSelectValue}
              handleSetSpanValue={this.handleSetSpanValue}
              handleSetState={this.handleSetState}
              saveEdit={this.saveEdit}
              setHoverTrue={this.setHoverTrue}
            />
          )}
        </Fragment>
      );
    }
}

export default TransitionInput;
