import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow, mount, render } from 'enzyme';
import { TransitionInput } from '../FormModal';
import sleep from '../../../__mocks__/sleep';

const mockStore = configureMockStore([ thunk ]);

const getMockedProps = () => ({
  boolean: false,
  clientInfo: false,
  dollar: '',
  index: 0,
  link: false,
  name: '',
  notes: false,
  placesInput: false,
  value: '',
})

const storeStateMock = {
  transitionClientInfo: {},
  transactionInfo: {},
}

const defaultState = {
  edit: false,
  hover: false,
  oldValue: '',
}

describe('<FormModal />', () => {
  let store
  let wrapper;
  let mockedProps;

  beforeEach(() => {
    mockedStore = mockStore(storeStateMock);
    mockedProps = getMockedProps();
  })

  it('renders without error', () => {
    expect(() => {
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
    }).not.toThrow();
  });

  it('sets correct default state on constructor', () => {
    wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
    const state = wrapper.instance().state;
    expect(state.edit).toEqual(false);
    expect(state.hover).toEqual(false);
    expect(state.oldValue).toEqual('');
  });

  it('renders one NotesComponent when notes', () => {
    mockedProps.notes = true;
    wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
    expect(wrapper.find('NotesComponent')).toHaveLength(1);
  });

  it('renders one LinkComponent when link', () => {
    mockedProps.link = true;
    wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
    expect(wrapper.find('NotesComponent')).toHaveLength(1);
  });

  it('renders one DefaultComponent by default', () => {
    wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
    expect(wrapper.find('NotesComponent')).toHaveLength(1);
  });

  describe('when on cancelEdit', () => {
    it('successfully sets state to false and store[0] to oldValue when index === 1', () => {
      mockedProps.name = 'test';
      mockedProps.index = 1;
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().cancelEdit();
      return sleep(10).then(() => {
        expect(wrapper.instance().state.test).toEqual(true);
        expect(wrapper.instance().store.transactionInfo.test[0]).toEqual('');
      });
    });

    it('successfully sets state to false and store to oldValue when index === 0', () => {
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().cancelEdit();
      return sleep(10).then(() => {
        expect(wrapper.instance().state.test).toEqual(true);
        expect(wrapper.instance().store.transactionInfo.test).toEqual('');
      });
    });
  });

  describe('when on convertToBoolean', () => {
    it('successfully sets store to true when param value === "Yes"', () => {
      const event = {
        target: {
          value: 'Yes',
        }
      }
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().convertToBoolean(event);
      return sleep(10).then(
        expect(wrapper.instance().store.transactionInfo.test).toEqual(true),
      );
    });

    it('successfully sets store to false when param value === "No"', () => {
      const event = {
        target: {
          value: 'No',
        }
      }
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().convertToBoolean(event);
      return sleep(10).then(
        expect(wrapper.instance().store.transactionInfo.test).toEqual(false),
      );
    });

    it('successfully sets store to null when param value === "Select an option"', () => {
      const event = {
        target: {
          value: 'Select an option',
        }
      }
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().convertToBoolean(event);
      return sleep(10).then(
        expect(wrapper.instance().store.transactionInfo.test).toEqual(null),
      );
    });
  });

  describe('when on enterEditMode', () => {
    it('successfully does nothing when store approved === true', () => {
      mockedStore.transactionInfo.approved = true;
      mockedStore.transactionInfo.test = 'storeTest';
      mockedProps.index = 0;
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().enterEditMode();
      return sleep(10).then(() => {
        expect(wrapper.instance().state).toEqual(defaultState);
        expect(wrapper.instance().store).toEqual(mockedStore);
      });
    });

    it('successfully sets state when store approved === false and index === 0', () => {
      mockedStore.transactionInfo.approved = false;
      mockedStore.transactionInfo.test = 'storeTest';
      mockedProps.index = 0;
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().enterEditMode();
      return sleep(10).then(() => {
        expect(wrapper.instance().state.oldValue).toEqual('storeTest');
        expect(wrapper.instance().state.edit).toEqual(true);
      });
    });

    it('successfully sets state when store approved === false and index === 1', () => {
      mockedStore.transactionInfo.approved = false;
      mockedStore.transactionInfo.test[0] = 'storeTest';
      mockedProps.index = 1;
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().enterEditMode();
      return sleep(10).then(() => {
        expect(wrapper.instance().state.oldValue).toEqual('storeTest');
        expect(wrapper.instance().state.edit).toEqual(true);
      });
    });
  });

  describe('when on handleAddressChanged', () => {
    it('successfully does nothing when approved === true', () => {
      mockedStore.transactionInfo.approved = true;
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleAddressChanged('testAddress', 'transactionInfo');
      return sleep(10).then(() => {
        expect(wrapper.instance().state).toEqual(defaultState);
        expect(wrapper.instance().store).toEqual(mockedStore);
      });
    });

    it('successfully updates store when approved === false and index === 1', () => {
      mockedStore.transactionInfo.approved = false;
      mockedProps.index = 1;
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleAddressChanged('testAddress', 'transactionInfo');
      return sleep(10).then(
        expect(wrapper.instance().store.transactionInfo.test[0]).toEqual('testAddress'),
      );
    });

    it('successfully updates store when approved === false and index === 0', () => {
      mockedStore.transactionInfo.approved = false;
      mockedProps.index = 0;
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleAddressChanged('testAddress', 'transactionInfo');
      return sleep(10).then(
        expect(wrapper.instance().store.transactionInfo.test).toEqual('testAddress'),
      );
    });
  });

  // describe('when on handleAddressSelected', () => {
  //
  // });

  describe('when on handleInputChange', () => {
    it('successfully does nothing when approved === true', () => {
      const event = {
        target: {
          value: 'eventTest',
        }
      }
      mockedStore.transactionInfo.approved = true;
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleInputChange(event, 'transactionInfo');
      return sleep(10).then(() => {
        expect(wrapper.instance().state).toEqual(defaultState);
        expect(wrapper.instance().store).toEqual(mockedStore);
      });
    });

    it('successfully updates store when approved === false and index === 1', () => {
      mockedStore.transactionInfo.approved = false;
      mockedProps.index = 1;
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleInputChange(event, 'transactionInfo');
      return sleep(10).then(
        expect(wrapper.instance().store.transactionInfo.test[0]).toEqual('testAddress'),
      );
    });

    it('successfully updates store when approved === false and index === 0', () => {
      const event = {
        target: {
          value: 'eventTest',
        }
      }
      mockedStore.transactionInfo.approved = true;
      mockedProps.index = 0;
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleInputChange(event, 'transactionInfo');
      return sleep(10).then(
        expect(wrapper.instance().store.transactionInfo.test).toEqual('testAddress'),
      );
    });
  });

  describe('when on handleSetSelectValue', () => {
    it('successfully returns value if value === 1', () => {
      mockedProps.value = 1;
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleSetSelectValue('transactionInfo').toEqual(1);
    });

    it('successfully returns "Yes" if value === 0 and store === "true"', () => {
      mockedProps.value = 0;
      mockdeProps.name = 'test';
      mockedStore.transactionInfo.test = 'true';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleSetSelectValue('transactionInfo').toEqual('Yes');
    });

    it('successfully returns "No" if value === 0 and store === "false"', () => {
      mockedProps.value = 0;
      mockdeProps.name = 'test';
      mockedStore.transactionInfo.test = 'false';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleSetSelectValue('transactionInfo').toEqual('Yes');
    });

    it('successfully returns "Select an option" if value === 0 and store === null', () => {
      mockedProps.value = 0;
      mockdeProps.name = 'test';
      mockedStore.transactionInfo.test = null;
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleSetSelectValue('transactionInfo').toEqual('Select an option');
    });
  });

  describe('when on handleSetSpanValue', () => {
    it('successfully returns string with $ if dollar === true and boolean === false and index === 0', () => {
      mockedProps.boolean = false;
      mockedProps.dollar = true;
      mockedProps.index = 0;
      mockdeProps.name = 'test';
      mockedStore.transactionInfo.test = 'test';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleSetSpanValue('transactionInfo').toEqual('$test');
    });

    it('successfully returns string without $ if dollar === false and boolean === false and index === 0', () => {
      mockedProps.boolean = false;
      mockedProps.dollar = false;
      mockedProps.index = 0;
      mockdeProps.name = 'test';
      mockedStore.transactionInfo.test = 'test';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleSetSpanValue('transactionInfo').toEqual('test');
    });

    it('successfully returns string without $ if dollar === false and boolean === false and index === 0', () => {
      mockedProps.boolean = false;
      mockedProps.dollar = false;
      mockedProps.index = 0;
      mockdeProps.name = 'test';
      mockedStore.transactionInfo.test = 'test';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleSetSpanValue('transactionInfo').toEqual('test');
    });

    it('successfully returns value if boolean === true and index === 0 and value === 1', () => {
      mockedProps.boolean = true;
      mockedProps.index = 0;
      mockdeProps.name = 'test';
      mockedProps.value = 1;
      mockedStore.transactionInfo.test = 'true';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleSetSpanValue('transactionInfo').toEqual(1);
    });

    it('successfully returns "Yes" if boolean === true and index === 0 and store === "true"', () => {
      mockedProps.boolean = true;
      mockedProps.index = 0;
      mockdeProps.name = 'test';
      mockedProps.value = 0;
      mockedStore.transactionInfo.test = 'true';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleSetSpanValue('transactionInfo').toEqual('Yes');
    });

    it('successfully returns "No" if boolean === true and index === 0 and store === "false"', () => {
      mockedProps.boolean = true;
      mockedProps.index = 0;
      mockdeProps.name = 'test';
      mockedProps.value = 0;
      mockedStore.transactionInfo.test = 'false';
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleSetSpanValue('transactionInfo').toEqual('No');
    });

    it('successfully returns "Select an option" if boolean === true and index === 0 and store === null', () => {
      mockedProps.boolean = true;
      mockedProps.index = 0;
      mockdeProps.name = 'test';
      mockedProps.value = 0;
      mockedStore.transactionInfo.test = null;
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleSetSpanValue('transactionInfo').toEqual('Select an option');
    });

    it('successfully returns store if boolean === false and index === 1', () => {
      mockedProps.boolean = false;
      mockedProps.index = 1;
      mockdeProps.name = 'test';
      mockedStore.transactionInfo.test[0] = null;
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().handleSetSpanValue('transactionInfo').toEqual('test');
    });
  });

  it('successfully handles state change', () => {
    wrapper = shallow(<TransitionInput { ...mockedProps }/>);
    wrapper.instance().handleSetState('test', true);
    return sleep(10).then(
      expect(wrapper.instance().state.test).toEqual(true),
    );
  });

  describe('when on saveEdit', () => {
    it('successfully updates store if clientInfo === false and transactionInfo.approved === false and props.name includes "advised_salary"', () => {
      mockedProps.clientInfo = false;
      mockdeProps.name = 'advised_salary';
      mockedStore.transactionInfo.advised_salary = 999.9999;
      mockedStore.transactionInfo.approved = false;
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().saveEdit(true);
      return sleep(10).then(
        expect(wrapper.instance().store.transactionInfo.advised_salary).toEqual(999.999),
      );
    });

    it('successfully updates state if removeBtn === true', () => {
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().saveEdit(true);
      return sleep(10).then(() => {
        expect(wrapper.instance().state.edit).toEqual(false);
        expect(wrapper.instance().state.hover).toEqual(false);
      });
    });

    it('successfully updates state if removeBtn === false', () => {
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().saveEdit(false);
      return sleep(10).then(() => {
        expect(wrapper.instance().state.edit).toEqual(false);
      });
    });
  });

  describe('when on setHoverTrue', () => {
    it('successfully updates state if clientInfo === true', () => {
      mockedProps.clientInfo = true;
      mockedStore.transactionInfo.approved = true;
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().setHoverTrue();
      return sleep(10).then(() => {
        expect(wrapper.instance().state.hover).toEqual(true);
      });
    });

    it('successfully updates state if store === false', () => {
      mockedStore.transactionInfo.approved = false;
      wrapper = shallow(<TransitionInput { store={mockedStore}, ...mockedProps }/>);
      wrapper.instance().setHoverTrue();
      return sleep(10).then(() => {
        expect(wrapper.instance().state.hover).toEqual(true);
      });
    });
  });
});
