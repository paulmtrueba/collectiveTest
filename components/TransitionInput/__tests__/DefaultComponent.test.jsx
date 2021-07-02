import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import DefaultComponent from '../DefaultComponent';

configure({adapter: new Adapter()});
const getMockedProps = () => ({
  boolean: false,
  dollar: false,
  edit: false,
  hover: false,
  placeholder: '',
  placesInput: false,
  newInfoHashString: '',
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
    expect(wrapper.find('ClickOutComponent')).toHaveLength(1);
  });

  it('doesn\'t renders ClickOutHandler when edit === false', () => {
    wrapper = shallow(<DefaultComponent { ...mockedProps }/>);
    expect(wrapper.find('ClickOutHandler')).toHaveLength(0);
  });

  it('renders one select element when edit and boolean', () => {
    mockedProps.boolean = true;
    mockedProps.edit = true;
    wrapper = shallow(<DefaultComponent { ...mockedProps }/>);
    expect(wrapper.find('select')).toHaveLength(1);
  });

  it('renders one PlacesAutocomplete when edit and boolean === false and placesInput', () => {
    mockedProps.boolean = false;
    mockedProps.edit = true;
    mockedProps.placesInput = true;
    wrapper = shallow(<DefaultComponent { ...mockedProps }/>);
    expect(wrapper.find('PlacesAutocomplete')).toHaveLength(1);
  });

  it('renders one input element when edit and boolean === false and placesInput === false', () => {
    mockedProps.boolean = false;
    mockedProps.edit = true;
    mockedProps.placesInput = false;
    wrapper = shallow(<DefaultComponent { ...mockedProps }/>);
    expect(wrapper.find('input')).toHaveLength(1);
  });
});
