import React from 'react';
import PropTypes from 'prop-types';

// created display component to break up the jsx in the parent container, legibility
// destructuring and formatting for legibility
// propTypes declarations for type checking, future proofing
// added displayName for unit testing identification, unit testing
// removed React.Fragment since render elements are surrounded by one parent div, legibility
// switched all event listeners over to call arrow functions to prevent class methods from being called on instanciation

const NotesComponent = ({
  hover,
  name,
  newInfoHashString,
  transactionInfo,
  handleInputChange,
  handleSetState,
  saveEdit,
  setHoverTrue,
}) => (
  <div
    onMouseEnter={() => setHoverTrue()}
    onMouseLeave={() => handleSetState('hover', false)}
    className="transition-input transition-note"
  >
    <textarea
      placeholder="Add a note about this section"
      value={transactionInfo[name]}
      onChange={e => handleInputChange(e, newInfoHashString)}
    />
    {hover && (
      <div
        onClick={() => saveEdit(true)}
        className="transition-edit"
      >
        Save
      </div>
    )}
  </div>
);

{
  const {
    bool,
    func,
    shape,
    string,
  } = PropTypes;

  NotesComponent.propTypes = {
    hover: bool.isRequired,
    name: string.isRequired,
    newInfoHashString: string.isRequired,
    transactionInfo: shape({}).isRequired,
    handleInputChange: func.isRequired,
    handleSetState: func.isRequired,
    saveEdit: func.isRequired,
    setHoverTrue: func.isRequired,
  };
}

NotesComponent.defaultProps = {};

NotesComponent.displayName = 'NotesComponent';

export default NotesComponent;
