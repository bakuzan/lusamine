import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { TypeContext } from 'context';
import { Button } from 'components/Buttons';
import List from 'components/List/List';
import TeamBreakdownPanel from 'components/TeamBreakdownPanel/TeamBreakdownPanel';
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
  }

  handleToggle() {
    this.setState(prev => ({ isCollapsed: !prev.isCollapsed }));
  }

  render() {
    const { members } = this.props;
    const noMembers = members.size === 0;

    return (
      <TypeContext.Consumer>
        {types => (
          <div className={classNames('team-breakdown')}>
            <Button
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
                items={TBU.buildTeamWeaknessCounts(types, members)}
                itemTemplate={item => (
                  <li
                    key={item.key}
                    className={classNames('team-breakdown__item')}
                  >
                    <div className={classNames('breakdown-item-title')}>
                      <div className={classNames('breakdown-item-title__text')}>
                        {capitaliseEachWord(item.key)}
                      </div>
                    </div>
                    <TeamBreakdownPanel types={types} data={item.counts} />
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
  members: PropTypes.object
};

export default TeamBreakdown;
