import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import List from 'components/List';
import { iterateKeysToArray } from 'utils/common';

function StatBreakdownPanel({ id, nameSource, data, onMouseState = {} }) {
  const keys = iterateKeysToArray(data).sort();

  return (
    <List
      shouldWrap
      columns={1}
      items={keys}
      itemTemplate={(key) => {
        const name = nameSource(key);
        const memberIds = data.get(key);
        const value = memberIds.length;
        const mouseState = Object.keys(onMouseState).reduce(
          (p, k) => ({ ...p, [k]: () => onMouseState[k](id, key, memberIds) }),
          {}
        );

        return (
          <li key={key} className={classNames('padding-5')} {...mouseState}>
            {`${name} - ${value}`}
          </li>
        );
      }}
    />
  );
}

StatBreakdownPanel.propTypes = {
  id: PropTypes.string.isRequired,
  nameSource: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  onMouseState: PropTypes.shape({
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired
  }).isRequired
};

export default StatBreakdownPanel;
