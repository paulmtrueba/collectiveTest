import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { geocodeByAddress } from 'react-places-autocomplete';

import { NotesComponent } from 'components/TransitionInput/NotesComponent';
import { LinkComponent } from 'components/TransitionInput/LinkComponent';
import { DefaultComponent } from 'components/TransitionInput/DefaultComponent';

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

      let returnValue = `${dollar ? '$' : ''}${this.store[newInfoHashString][name]}`

      if (boolean) returnValue = this.handleSetSelectValue(newInfoHashString);

      if (index) returnValue = this.store[newInfoHashString][name][index - 1];
      
      return returnValue;
    }

    handleSetState = (key, value) => {
      this.setState({
        [key]: value,
      });
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
      const { transactionInfo } = this.store;
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
              placeHolder={placeholder}
              placesInput={placesInput}
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
