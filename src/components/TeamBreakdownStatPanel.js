import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import List from 'components/List';
import { iterateKeysToArray } from 'utils/common';

const TeamBreakdownStatPanel = ({
  id,
  nameSource,
  data,
  onMouseState = {}
}) => {
  const keys = iterateKeysToArray(data).sort();

  return (
    <List
      shouldWrap
      columns={1}
      items={keys}
      itemTemplate={(key) => {
        const name = nameSource(key);
        const value = data.get(key);
        const mouseState = Object.keys(onMouseState).reduce(
          (p, k) => ({ ...p, [k]: () => onMouseState[k](id, key) }),
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
};

TeamBreakdownStatPanel.propTypes = {
  id: PropTypes.string.isRequired,
  nameSource: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  onMouseState: PropTypes.shape({
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired
  }).isRequired
};

export default TeamBreakdownStatPanel;
