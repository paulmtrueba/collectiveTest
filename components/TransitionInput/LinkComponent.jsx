import React from 'react';
import PropTypes from 'prop-types';

// created display component to break up thejsx in the parent container, legibility
// destructuring and formatting for legibility
// propTypes declarations for type checking
// added displayName for unit testing identification
// removed React.Fragment since render elements are surrounded by one parent div

const LinkComponent = ({
  name,
  transactionInfo,
  handleSetState,
  setHoverTrue,
}) => (
  <div
    onMouseEnter={setHoverTrue}
    onMouseLeave={() => handleSetState('hover', false)}
    className="transition-input transition-note"
  >
    <a href={transactionInfo[name]}>
      {transactionInfo[name]}
    </a>
  </div>
);

{
  const {
    func,
    shape,
    string,
  } = PropTypes;

  LinkComponent.propTypes = {
    name: string.isRequired,
    transactionInfo: shape({}).isRequired,
    handleSetState: func.isRequired,
    setHoverTrue: func.isRequired,
  };
}

LinkComponent.defaultProps = {};

LinkComponent.displayName = 'LinkComponent';

export default LinkComponent;
