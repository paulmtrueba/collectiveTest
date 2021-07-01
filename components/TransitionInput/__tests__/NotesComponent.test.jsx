import React from 'react';
import configureMockStore from 'redux-mock-store';
import { shallow, mount, render } from 'enzyme';
import { NotesComponent } from '../FormModal';
import sleep from '../../../__mocks__/sleep';

const getMockedProps = () => ({
  hover: false,,
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
    mockdeProps.hover = true;
    wrapper = shallow(<NotesComponent { ...mockedProps }/>);
    expect(wrapper.find('.transition-edit').text()).toEqual('Save');
  });
});
