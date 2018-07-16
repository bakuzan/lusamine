import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import Strings from 'constants/strings';

const List = props => {
  const hasItems = props.items.length > 0;
  return (
    <ul
      className={classNames('list', props.className, {
        column: props.shouldWrap
      })}
    >
      {!hasItems && <li key="NONE">{Strings.emptyList}</li>}
      {hasItems && props.items.map(props.itemTemplate)}
    </ul>
  );
};

List.propTypes = {
  shouldWrap: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number])
  ).isRequired,
  itemTemplate: PropTypes.func.isRequired
};

export default List;
