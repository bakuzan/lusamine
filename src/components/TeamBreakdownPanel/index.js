import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Grid } from 'meiko-lib';
import TypeBlock from 'components/TypeBlock';
import * as TBPU from './TeamBreakdownPanelUtils';

import './TeamBreakdownPanel.scss';

function TeamBreakdownPanel({
  id,
  data,
  types,
  panelModifier,
  onMouseState = {}
}) {
  const typesList = [...types.values()];

  return (
    <Grid
      className={classNames('breakdown-panel', [
        `breakdown-panel--good-is_${panelModifier}`
      ])}
      items={typesList}
    >
      {(t) => {
        const memberIds = data.get(t.id);
        const score = memberIds.length;
        const typeStatusClass = TBPU.getClassForScore(score);
        const title = TBPU.getScoreDescription(panelModifier, score);
        const mouseState = Object.keys(onMouseState).reduce(
          (p, k) => ({ ...p, [k]: () => onMouseState[k](id, t.id, memberIds) }),
          {}
        );

        return (
          <li
            key={t.id}
            className={classNames(
              TBPU.BREAKDOWN_ITEM_CLASS,
              'list-item-bottom-spacing',
              typeStatusClass
            )}
            title={title}
            {...mouseState}
          >
            <TypeBlock value={t.name} />
            <div className={classNames('breakdown-panel__count')}>{score}</div>
          </li>
        );
      }}
    </Grid>
  );
}

TeamBreakdownPanel.propTypes = {
  id: PropTypes.string.isRequired,
  panelModifier: PropTypes.string,
  types: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onMouseState: PropTypes.shape({
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired
  }).isRequired
};

export default TeamBreakdownPanel;
