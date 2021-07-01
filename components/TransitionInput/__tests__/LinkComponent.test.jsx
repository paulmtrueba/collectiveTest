import React from 'react';
import configureMockStore from 'redux-mock-store';
import { shallow, mount, render } from 'enzyme';
import { LinkComponent } from '../FormModal';
import sleep from '../../../__mocks__/sleep';

const getMockedProps = () => ({
  name: '',
  transactionInfo: {},
  handleSetState: jest.fn(),
  setHoverTrue: jest.fn(),
})

describe('<LinkComponent />', () => {
  let wrapper;
  let mockedProps;

  beforeEach(() => {
    mockedProps = getMockedProps();
  })

  it('renders without error', () => {
    expect(() => {
      wrapper = shallow(<LinkComponent { ...mockedProps }/>);
    }).not.toThrow();
  });

  it('renders one element with .transition-input class', () => {
    wrapper = shallow(<LinkComponent { ...mockedProps }/>);
    expect(wrapper.find('.transition-input')).toHaveLength(1);
  });

  it('renders one link with text defined by props.transactionInfo', () => {
    mockedProps.name = 'test';
    mockdeProps.transactionInfo.test = 'linkTest';
    wrapper = shallow(<LinkComponent { ...mockedProps }/>);
    expect(wrapper.find('a')).toHaveLength(1);
    expect(wrapper.find('a').text()).toEqual('linkTest');
  });
});
