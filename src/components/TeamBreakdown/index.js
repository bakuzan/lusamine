import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { TypeContext } from 'context';
import { Button } from 'components/Buttons';
import List from 'components/List';
import EffectiveTypePanel from 'components/TeamBreakdownPanel/EffectiveTypePanel';
import StatBreakdownPanel from 'components/TeamBreakdownPanel/StatPanel';
import * as TBU from './TeamBreakdownUtils';
import { capitaliseEachWord } from 'utils/common';

import './TeamBreakdown.scss';

class TeamBreakdown extends React.Component {
  static contextType = TypeContext;

  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleMouseEnterLeave = this.handleMouseEnterLeave.bind(this);
  }

  handleToggle() {
    this.setState((prev) => ({ isCollapsed: !prev.isCollapsed }));
  }

  handleMouseEnterLeave(...values) {
    const { onMouseState } = this.props;
    if (onMouseState) {
      onMouseState(...values);
    }
  }

  render() {
    let types = this.context;
    const {
      className,
      contentClassName,
      alwaysOpen,
      filterZeroes,
      typeBreakdownOnly,
      members
    } = this.props;

    const isCollapsed = !alwaysOpen && this.state.isCollapsed;
    const renderNonTypes = !typeBreakdownOnly;
    const noMembers = members.size === 0;
    const mouseState = {
      onMouseEnter: this.handleMouseEnterLeave,
      onMouseLeave: this.handleMouseEnterLeave
    };

    const statCounts = TBU.buildStatCounts(members);
    const weaknessCounts = TBU.buildTeamWeaknessCounts(
      types,
      members,
      filterZeroes
    );

    return (
      <div className={classNames('team-breakdown', className)}>
        {!alwaysOpen && (
          <Button
            id="toggle-breakdown"
            isAction
            className={classNames('team-breakdown__action', {
              'team-breakdown__action--hide': noMembers
            })}
            onClick={this.handleToggle}
          >
            {isCollapsed ? `Show team breakdown` : `Hide team breakdown`}
          </Button>
        )}
        <div
          className={classNames(
            'team-breakdown__content',
            {
              'team-breakdown__content--collapsed': isCollapsed
            },
            contentClassName
          )}
        >
          {renderNonTypes && (
            <List
              className={classNames(
                'team-breakdown__list',
                'stat-breakdown-list'
              )}
              items={statCounts}
              itemTemplate={(item) => (
                <li
                  key={item.key}
                  className={classNames(
                    'team-breakdown__item',
                    'stat-breakdown-list__item'
                  )}
                >
                  <div className={classNames('breakdown-item-title')}>
                    <div className={classNames('breakdown-item-title__text')}>
                      {item.key}
                    </div>
                  </div>
                  <StatBreakdownPanel
                    id={item.key}
                    nameSource={item.getKeyName}
                    data={item.counts}
                    onMouseState={{ ...mouseState }}
                  />
                </li>
              )}
            />
          )}
          <List
            columns={1}
            className={classNames(
              'team-breakdown__list',
              'type-breakdown-list'
            )}
            items={weaknessCounts}
            itemTemplate={(item) => (
              <li
                key={item.key}
                className={classNames(
                  'team-breakdown__item',
                  'type-breakdown-list__item'
                )}
              >
                <div className={classNames('breakdown-item-title')}>
                  <div className={classNames('breakdown-item-title__text')}>
                    {capitaliseEachWord(item.key)}
                  </div>
                </div>
                <EffectiveTypePanel
                  id={item.key}
                  panelModifier={item.goodCountModifier}
                  types={types}
                  data={item.counts}
                  onMouseState={{ ...mouseState }}
                />
              </li>
            )}
          />
        </div>
      </div>
    );
  }
}

TeamBreakdown.defaultProps = {
  alwaysOpen: false,
  filterZeroes: false,
  typeBreakdownOnly: false
};

TeamBreakdown.propTypes = {
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  alwaysOpen: PropTypes.bool,
  filterZeroes: PropTypes.bool,
  typeBreakdownOnly: PropTypes.bool,
  members: PropTypes.instanceOf(Map),
  onMouseState: PropTypes.func
};

export default TeamBreakdown;
