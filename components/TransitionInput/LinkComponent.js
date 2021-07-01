import React from 'react';
import PropTypes from 'prop-types';

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
