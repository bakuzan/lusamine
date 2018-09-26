import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { TypeContext } from 'context';
import { Button } from 'components/Buttons';
import List from 'components/List/List';
import TeamBreakdownPanel from 'components/TeamBreakdownPanel/TeamBreakdownPanel';
import TeamBreakdownStatPanel from 'components/TeamBreakdownStatPanel/TeamBreakdownStatPanel';
import * as TBU from './TeamBreakdownUtils';
import { capitaliseEachWord } from 'utils/common';

import './TeamBreakdown.css';

class TeamBreakdown extends React.Component {
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
    const { members } = this.props;
    const noMembers = members.size === 0;
    const mouseState = {
      onMouseEnter: this.handleMouseEnterLeave,
      onMouseLeave: this.handleMouseEnterLeave
    };

    return (
      <TypeContext.Consumer>
        {(types) => (
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
                shouldWrap
                className={classNames('team-breakdown__list')}
                items={TBU.buildStatCounts(members)}
                itemTemplate={(item) => (
                  <li
                    key={item.key}
                    className={classNames('team-breakdown__item')}
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
                shouldWrap
                className={classNames('team-breakdown__list')}
                items={TBU.buildTeamWeaknessCounts(types, members)}
                itemTemplate={(item) => (
                  <li
                    key={item.key}
                    className={classNames('team-breakdown__item')}
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
        )}
      </TypeContext.Consumer>
    );
  }
}

TeamBreakdown.propTypes = {
  members: PropTypes.object,
  onMouseState: PropTypes.func.isRequired
};

export default TeamBreakdown;
