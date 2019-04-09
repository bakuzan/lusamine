import PropTypes from 'prop-types';
import React from 'react';

import { List as MkoList } from 'meiko-lib';
import Strings from 'constants/strings';

const List = ({ items, itemTemplate, ...props }) => {
  const hasItems = items.length > 0;

  return (
    <MkoList {...props}>
      {!hasItems && <li key="NONE">{Strings.emptyList}</li>}
      {hasItems && items.map(itemTemplate)}
    </MkoList>
  );
};

List.propTypes = {
  shouldWrap: PropTypes.bool,
  columns: PropTypes.number,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.any)
    ])
  ).isRequired,
  itemTemplate: PropTypes.func.isRequired
};

export default List;
