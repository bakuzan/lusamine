import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { TypeContext } from 'context';
import { Button } from 'components/Buttons';
import List from 'components/List';
import TeamBreakdownPanel from 'components/TeamBreakdownPanel';
import TeamBreakdownStatPanel from 'components/TeamBreakdownStatPanel';
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

  handleMouseEnterLeave(dataType, dataId) {
    this.props.onMouseState(dataType, dataId);
  }

  render() {
    let types = this.context;
    const { members } = this.props;
    const noMembers = members.size === 0;
    const mouseState = {
      onMouseEnter: this.handleMouseEnterLeave,
      onMouseLeave: this.handleMouseEnterLeave
    };

    const statCounts = TBU.buildStatCounts(members);
    const oldWeaknessCounts = TBU.buildTeamWeaknessCounts(types, members);
    const weaknessCounts = TBU.NEW_buildTeamWeaknessCounts(types, members);
    console.log('weakness > ', oldWeaknessCounts);
    console.log('NEW weakness > ', weaknessCounts);

    return (
      <div className={classNames('team-breakdown')}>
        <Button
          id="toggle-breakdown"
          isAction
          className={classNames('team-breakdown__action', {
            'team-breakdown__action--hide': noMembers
          })}
          onClick={this.handleToggle}
        >
          {this.state.isCollapsed
            ? `Show team breakdown`
            : `Hide team breakdown`}
        </Button>
        <div
          className={classNames('team-breakdown__content', {
            'team-breakdown__content--collapsed': this.state.isCollapsed
          })}
        >
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
                <TeamBreakdownStatPanel
                  id={item.key}
                  nameSource={item.getKeyName}
                  data={item.counts}
                  onMouseState={{ ...mouseState }}
                />
              </li>
            )}
          />
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
                <TeamBreakdownPanel
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

TeamBreakdown.propTypes = {
  members: PropTypes.object,
  onMouseState: PropTypes.func.isRequired
};

export default TeamBreakdown;
