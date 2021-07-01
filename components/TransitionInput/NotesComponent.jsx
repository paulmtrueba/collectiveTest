import React from 'react';
import PropTypes from 'prop-types';

// created display component to break up thejsx in the parent container, legibility
// destructuring and formatting for legibility
// propTypes declarations for type checking
// added displayName for unit testing identification
// removed React.Fragment since render elements are surrounded by one parent div

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
    boolean,
    func,
    shape,
    string,
  } = PropTypes;

  NotesComponent.propTypes = {
    hover: boolean.isRequired,
    name: string.isRequired,
    newInfoHashString: string.isRequired,
    transactionInfo: shape({}).isRequired,
    handleInputChange: func.isRequried,
    handleSetState: func.isRequried,
    saveEdit: func.isRequried,
    setHoverTrue: func.isRequried,
  };
}

NotesComponent.defaultProps = {};

NotesComponent.displayName = 'NotesComponent';

export default NotesComponent;
