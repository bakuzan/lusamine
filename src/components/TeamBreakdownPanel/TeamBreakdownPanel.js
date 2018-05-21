import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import List from 'components/List/List';
import TypeBlock from 'components/TypeBlock/TypeBlock';

import './TeamBreakdownPanel.css';

class TeamBreakdownPanel extends React.Component {
  render() {
    const { data, types } = this.props;
    const typesList = [...types.values()];
    return (
      <List
        shouldWrap
        className={classNames('breakdown-panel')}
        items={typesList}
        itemTemplate={t => (
          <li key={t.id} className={classNames('breakdown-panel__item')}>
            <TypeBlock value={t.name} />
            <div className={classNames('breakdown-panel__count')}>
              {data.get(t.id)}
            </div>
          </li>
        )}
      />
    );
  }
}

TeamBreakdownPanel.propTypes = {
  types: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default TeamBreakdownPanel;
