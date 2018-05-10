import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import Strings from 'constants/strings';

const List = props => {
  const hasItems = props.items.length > 0;
  return (
    <div id={props.id} className={props.className}>
      <ul className={classNames('list', { column: props.shouldWrap })}>
        {!hasItems && <li key="NONE">{Strings.emptyList}</li>}
        {hasItems && props.items.map(props.itemTemplate)}
      </ul>
    </div>
  );
};

List.propTypes = {
  shouldWrap: PropTypes.bool
};

export default List;
