import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import List from 'components/List/List';
import { iterateKeysToArray } from 'utils/common';

const TeamBreakdownStatPanel = ({ nameSource, data }) => {
  const keys = iterateKeysToArray(data).sort();

  return (
    <List
      shouldWrap
      className={classNames('one')}
      items={keys}
      itemTemplate={key => {
        const name = nameSource(key);
        const value = data.get(key);

        return (
          <li key={key} className={classNames('padding-5')}>
            {`${name} - ${value}`}
          </li>
        );
      }}
    />
  );
};

TeamBreakdownStatPanel.propTypes = {
  nameSource: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

export default TeamBreakdownStatPanel;
