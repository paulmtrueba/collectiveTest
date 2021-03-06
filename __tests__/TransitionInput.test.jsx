import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import TransitionInput from '../TransitionInput';
import sleep from '../../../__mocks__/sleep';

configure({adapter: new Adapter()});
const getMockedProps = () => ({
  boolean: false,
  clientInfo: false,
  dollar: false,
  index: 0,
  link: false,
  name: '',
  notes: false,
  placeholder: '',
  placesInput: false,
  value: '',
  valueBasedOnIndex: '',
})

const storeStateMock = {
  transactionClientId: 0,
  transactionInfo: {},
  getTransitionPlanPotentialSavings: jest.fn(),
  updateClientInfo: jest.fn(),
  updateTransactionInfo: {},
}

const defaultState = {
  edit: false,
  hover: false,
  oldValue: '',
}

describe('<TransitionInput />', () => {
  let mockedStore;
  let wrapper;
  let mockedProps;

  beforeEach(() => {
    mockedStore = {
      store: storeStateMock,
    };
    mockedProps = getMockedProps();
  })

  it('renders without error', () => {
    expect(() => {
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
    }).not.toThrow();
  });

  it('sets correct default state on constructor', () => {
    wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
    const state = wrapper.instance().state;
    expect(state.edit).toEqual(false);
    expect(state.hover).toEqual(false);
    expect(state.oldValue).toEqual('');
  });

  it('renders one NotesComponent when notes', () => {
    mockedProps.notes = true;
    wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
    expect(wrapper.find('NotesComponent')).toHaveLength(1);
  });

  it('renders one LinkComponent when link', () => {
    mockedProps.link = true;
    wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
    expect(wrapper.find('LinkComponent')).toHaveLength(1);
  });

  it('renders one DefaultComponent by default', () => {
    wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
    expect(wrapper.find('DefaultComponent')).toHaveLength(1);
  });

  describe('when on cancelEdit', () => {
    it('successfully sets state to false and store[0] to oldValue when index === 1', () => {
      mockedProps.name = 'test';
      mockedProps.index = 1;
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().cancelEdit();
      return sleep(10).then(() => {
        expect(wrapper.instance().state.edit).toEqual(false);
        expect(wrapper.instance().store.transactionInfo.test[0]).toEqual('');
      });
    });

    it('successfully sets state to false and store to oldValue when index === 0', () => {
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().cancelEdit();
      return sleep(10).then(() => {
        expect(wrapper.instance().state.edit).toEqual(false);
        expect(wrapper.instance().store.transactionInfo.test).toEqual('');
      });
    });
  });

  describe('when on convertToBoolean', () => {
    it('successfully sets store to true when param value === \'Yes\'', () => {
      const event = {
        target: {
          value: 'Yes',
        }
      }
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().convertToBoolean(event);
      return sleep(10).then(
        expect(wrapper.instance().store.transactionInfo.test).toEqual(true),
      );
    });

    it('successfully sets store to false when param value === \'No\'', () => {
      const event = {
        target: {
          value: 'No',
        }
      }
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().convertToBoolean(event);
      return sleep(10).then(
        expect(wrapper.instance().store.transactionInfo.test).toEqual(false),
      );
    });

    it('successfully sets store to null when param value === \'Select an option\'', () => {
      const event = {
        target: {
          value: 'Select an option',
        }
      }
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
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
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
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
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
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
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
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
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
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
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().handleAddressChanged('testAddress', 'transactionInfo');
      return sleep(10).then(
        expect(wrapper.instance().store.transactionInfo.test[0]).toEqual('testAddress'),
      );
    });

    it('successfully updates store when approved === false and index === 0', () => {
      mockedStore.transactionInfo.approved = false;
      mockedProps.index = 0;
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
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
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().handleInputChange(event, 'transactionInfo');
      return sleep(10).then(() => {
        expect(wrapper.instance().state).toEqual(defaultState);
        expect(wrapper.instance().store).toEqual(mockedStore);
      });
    });

    it('successfully updates store when approved === false and index === 1', () => {
      const event = {
        target: {
          value: 'eventTest',
        }
      }
      mockedStore.transactionInfo.approved = false;
      mockedProps.index = 1;
      mockedProps.name = 'test';
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
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
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().handleInputChange(event, 'transactionInfo');
      return sleep(10).then(
        expect(wrapper.instance().store.transactionInfo.test).toEqual('testAddress'),
      );
    });
  });

  describe('when on handleSetSelectValue', () => {
    it('successfully returns value if value === 1', () => {
      mockedProps.value = 1;
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().handleSetSelectValue('transactionInfo').toEqual(1);
    });

    it('successfully returns \'Yes\' if value === 0 and store === \'true\'', () => {
      mockedProps.value = 0;
      mockedProps.name = 'test';
      mockedStore.transactionInfo.test = 'true';
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().handleSetSelectValue('transactionInfo').toEqual('Yes');
    });

    it('successfully returns \'No\' if value === 0 and store === \'false\'', () => {
      mockedProps.value = 0;
      mockedProps.name = 'test';
      mockedStore.transactionInfo.test = 'false';
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().handleSetSelectValue('transactionInfo').toEqual('Yes');
    });

    it('successfully returns \'Select an option\' if value === 0 and store === null', () => {
      mockedProps.value = 0;
      mockedProps.name = 'test';
      mockedStore.transactionInfo.test = null;
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().handleSetSelectValue('transactionInfo').toEqual('Select an option');
    });
  });

  describe('when on handleSetSpanValue', () => {
    it('successfully returns string with $ if dollar === true and boolean === false and index === 0', () => {
      mockedProps.boolean = false;
      mockedProps.dollar = true;
      mockedProps.index = 0;
      mockedProps.name = 'test';
      mockedStore.transactionInfo.test = 'test';
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().handleSetSpanValue('transactionInfo').toEqual('$test');
    });

    it('successfully returns string without $ if dollar === false and boolean === false and index === 0', () => {
      mockedProps.boolean = false;
      mockedProps.dollar = false;
      mockedProps.index = 0;
      mockedProps.name = 'test';
      mockedStore.transactionInfo.test = 'test';
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().handleSetSpanValue('transactionInfo').toEqual('test');
    });

    it('successfully returns value if boolean === true and index === 0 and value === 1', () => {
      mockedProps.boolean = true;
      mockedProps.index = 0;
      mockedProps.name = 'test';
      mockedProps.value = 1;
      mockedStore.transactionInfo.test = 'true';
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().handleSetSpanValue('transactionInfo').toEqual(1);
    });

    it('successfully returns \'Yes\' if boolean === true and index === 0 and store === \'true\'', () => {
      mockedProps.boolean = true;
      mockedProps.index = 0;
      mockedProps.name = 'test';
      mockedProps.value = 0;
      mockedStore.transactionInfo.test = 'true';
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().handleSetSpanValue('transactionInfo').toEqual('Yes');
    });

    it('successfully returns \'No\' if boolean === true and index === 0 and store === \'false\'', () => {
      mockedProps.boolean = true;
      mockedProps.index = 0;
      mockedProps.name = 'test';
      mockedProps.value = 0;
      mockedStore.transactionInfo.test = 'false';
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().handleSetSpanValue('transactionInfo').toEqual('No');
    });

    it('successfully returns \'Select an option\' if boolean === true and index === 0 and store === null', () => {
      mockedProps.boolean = true;
      mockedProps.index = 0;
      mockedProps.name = 'test';
      mockedProps.value = 0;
      mockedStore.transactionInfo.test = null;
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().handleSetSpanValue('transactionInfo').toEqual('Select an option');
    });

    it('successfully returns store if boolean === false and index === 1', () => {
      mockedProps.boolean = false;
      mockedProps.index = 1;
      mockedProps.name = 'test';
      mockedStore.transactionInfo.test[0] = null;
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().handleSetSpanValue('transactionInfo').toEqual('test');
    });
  });

  describe('when on handleSetState', () => {
    it('successfully handles state change', () => {
      wrapper = shallow(<TransitionInput { ...mockedProps }/>);
      wrapper.instance().handleSetState('test', true);
      return sleep(10).then(
        expect(wrapper.instance().state.test).toEqual(true),
      );
    });
  });

  describe('when on saveEdit', () => {
    it('successfully updates store if clientInfo === false and transactionInfo.approved === false and props.name includes \'advised_salary\'', () => {
      mockedProps.clientInfo = false;
      mockedProps.name = 'advised_salary';
      mockedStore.transactionInfo.advised_salary = 999.9999;
      mockedStore.transactionInfo.approved = false;
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().saveEdit(true);
      return sleep(10).then(
        expect(wrapper.instance().store.transactionInfo.advised_salary).toEqual(999.999),
      );
    });

    it('successfully updates state if removeBtn === true', () => {
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().saveEdit(true);
      return sleep(10).then(() => {
        expect(wrapper.instance().state.edit).toEqual(false);
        expect(wrapper.instance().state.hover).toEqual(false);
      });
    });

    it('successfully updates state if removeBtn === false', () => {
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
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
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().setHoverTrue();
      return sleep(10).then(() => {
        expect(wrapper.instance().state.hover).toEqual(true);
      });
    });

    it('successfully updates state if store === false', () => {
      mockedStore.transactionInfo.approved = false;
      wrapper = shallow(<TransitionInput { ...mockedStore  } { ...mockedProps }/>);
      wrapper.instance().setHoverTrue();
      return sleep(10).then(() => {
        expect(wrapper.instance().state.hover).toEqual(true);
      });
    });
  });
});
