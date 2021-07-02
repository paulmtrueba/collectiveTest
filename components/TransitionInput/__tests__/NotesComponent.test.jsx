import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import NotesComponent from '../NotesComponent';

configure({adapter: new Adapter()});
const getMockedProps = () => ({
  hover: false,
  name: '',
  newInfoHashString: '',
  transactionInfo: {},
  handleInputChange: jest.fn(),
  handleSetState: jest.fn(),
  saveEdit: jest.fn(),
  setHoverTrue: jest.fn(),
})

describe('<NotesComponent />', () => {
  let wrapper;
  let mockedProps;

  beforeEach(() => {
    mockedProps = getMockedProps();
  })

  it('renders without error', () => {
    expect(() => {
      wrapper = shallow(<NotesComponent { ...mockedProps }/>);
    }).not.toThrow();
  });

  it('renders one element with .transition-input class', () => {
    wrapper = shallow(<NotesComponent { ...mockedProps }/>);
    expect(wrapper.find('.transition-input')).toHaveLength(1);
  });

  it('renders one textarea', () => {
    wrapper = shallow(<NotesComponent { ...mockedProps }/>);
    expect(wrapper.find('textarea')).toHaveLength(1);
  });

  it('renders one save div if hover', () => {
    mockedProps.hover = true;
    wrapper = shallow(<NotesComponent { ...mockedProps }/>);
    expect(wrapper.find('.transition-edit').text()).toEqual('Save');
  });
});
