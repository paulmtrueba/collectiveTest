import React from 'react';
import configureMockStore from 'redux-mock-store';
import { shallow, mount, render } from 'enzyme';
import { DefaultComponent } from '../FormModal';
import sleep from '../../../__mocks__/sleep';

const getMockedProps = () => ({
  boolean: false,
  dollar: false,
  edit: false,
  hover: false,
  placeHolder: '',
  placesInput: false,
  valueBasedOnIndex: '',
  cancelEdit: jest.fn(),
  convertToBoolean: jest.fn(),
  enterEditMode: jest.fn(),
  handleAddressChanged: jest.fn(),
  handleAddressSelected: jest.fn(),
  handleInputChange: jest.fn(),
  handleSetSelectValue: jest.fn(),
  handleSetSpanValue: jest.fn(),
  handleSetState: jest.fn(),
  saveEdit: jest.fn(),
  setHoverTrue: jest.fn(),
})

describe('<DefaultComponent />', () => {
  let wrapper;
  let mockedProps;

  beforeEach(() => {
    mockedProps = getMockedProps();
  })

  it('renders without error', () => {
    expect(() => {
      wrapper = shallow(<DefaultComponent { ...mockedProps }/>);
    }).not.toThrow();
  });

  it('renders one ClickOutHandler when edit', () => {
    mockedProps.edit = true;
    wrapper = shallow(<DefaultComponent { ...mockedProps }/>);
    expect(wrapper.find('ClickOutHandler')).toHaveLength(1);
  });

  it('doesn\'t renders ClickOutHandler when edit === false', () => {
    wrapper = shallow(<DefaultComponent { ...mockedProps }/>);
    expect(wrapper.find('ClickOutHandler')).toHaveLength(0);
  });

  it('renders one select element when edit and boolean', () => {
    mockdeProps.boolean = true;
    mockedProps.edit = true;
    wrapper = shallow(<DefaultComponent { ...mockedProps }/>);
    expect(wrapper.find('select')).toHaveLength(1);
  });

  it('renders one PlacesAutocomplete when edit and boolean === false and placesInput', () => {
    mockdeProps.boolean = false;
    mockedProps.edit = true;
    mockedProps.placesInput = true;
    wrapper = shallow(<DefaultComponent { ...mockedProps }/>);
    expect(wrapper.find('PlacesAutocomplete')).toHaveLength(1);
  });

  it('renders one input element when edit and boolean === false and placesInput === false', () => {
    mockdeProps.boolean = false;
    mockedProps.edit = true;
    mockedProps.placesInput = false;
    wrapper = shallow(<DefaultComponent { ...mockedProps }/>);
    expect(wrapper.find('input')).toHaveLength(1);
  });
});
