import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import List from 'components/List/List';
import TypeBlock from 'components/TypeBlock/TypeBlock';
import * as TBPU from './TeamBreakdownPanelUtils';

import './TeamBreakdownPanel.css';

class TeamBreakdownPanel extends React.Component {
  render() {
    const { data, types, panelModifier } = this.props;
    const typesList = [...types.values()];

    return (
      <List
        shouldWrap
        className={classNames('breakdown-panel', [
          `breakdown-panel--good-is_${panelModifier}`
        ])}
        items={typesList}
        itemTemplate={t => {
          const score = data.get(t.id);
          const typeStatusClass = TBPU.getClassForScore(score);
          const title = TBPU.getScoreDescription(panelModifier, score);

          return (
            <li
              key={t.id}
              className={classNames(
                TBPU.BREAKDOWN_ITEM_CLASS,
                'list-item-bottom-spacing',
                typeStatusClass
              )}
              title={title}
            >
              <TypeBlock value={t.name} />
              <div className={classNames('breakdown-panel__count')}>
                {score}
              </div>
            </li>
          );
        }}
      />
    );
  }
}

TeamBreakdownPanel.propTypes = {
  panelModifier: PropTypes.string,
  types: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default TeamBreakdownPanel;
