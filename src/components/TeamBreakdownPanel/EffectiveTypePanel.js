import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Grid } from 'mko';
import TypeBlock from 'components/TypeBlock';
import * as TBPU from './TeamBreakdownPanelUtils';

import './TeamBreakdownPanel.scss';

function EffectiveTypeBreakdownPanel({
  id,
  data,
  types,
  panelModifier,
  onMouseState = {}
}) {
  const listOfMemberIds = [...types.values()].reduce((p, t) => {
    const ids = data.get(t.id);
    if (!ids) {
      return p;
    }
    return [...p, [t, ids]];
  }, []);

  return (
    <Grid
      className={classNames('breakdown-panel', {
        [`breakdown-panel--good-is_${panelModifier}`]: true,
        [`breakdown-panel--empty`]: listOfMemberIds.length === 0
      })}
      items={listOfMemberIds}
    >
      {([t, memberIds]) => {
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

EffectiveTypeBreakdownPanel.propTypes = {
  id: PropTypes.string.isRequired,
  panelModifier: PropTypes.string,
  types: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onMouseState: PropTypes.shape({
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired
  }).isRequired
};

export default EffectiveTypeBreakdownPanel;
