import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import LinkComponent from '../LinkComponent';

configure({adapter: new Adapter()});
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
    mockedProps.transactionInfo.test = 'linkTest';
    wrapper = shallow(<LinkComponent { ...mockedProps }/>);
    expect(wrapper.find('a')).toHaveLength(1);
    expect(wrapper.find('a').text()).toEqual('linkTest');
  });
});
