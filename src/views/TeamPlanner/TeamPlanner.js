import classNames from 'classnames';
import React from 'react';

import Filters from 'components/Filters/Filters';
import Team from 'components/Team/Team';
import List from 'components/List/List';
import Sprite from 'components/Sprite/Sprite';
import { PokedexContext } from 'context';
import Strings from 'constants/strings';
import {
  getUrlQueryStringAsObject,
  createSetFromIdString,
  createIdStringFromSet
} from 'utils/common';
import * as TPU from './TeamPlannerUtils';

import './TeamPlanner.css';

class PlannerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTeamIds: createSetFromIdString(
        getUrlQueryStringAsObject(props.location).team
      ),
      search: '',
      generations: TPU.generationDefaults
    };

    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleGenerationFilter = this.handleGenerationFilter.bind(this);
    this.handleSpriteSelection = this.handleSpriteSelection.bind(this);
    this.handleMembersUpdate = this.handleMembersUpdate.bind(this);
  }

  componentDidUpdate(prevProps) {
    const queryObject = getUrlQueryStringAsObject(this.props.location);
    const currentIds = createIdStringFromSet(this.state.currentTeamIds);
    if ((currentIds || queryObject.team) && queryObject.team !== currentIds) {
      console.log('UPDATED', 'qo:', queryObject, 'ids: ', currentIds);
      this.setState({
        currentTeamIds: createSetFromIdString(queryObject.team)
      });
    }
  }

  updateTeamQueryString(memberIds, newId) {
    const idStr = createIdStringFromSet(memberIds, newId);
    this.props.history.push(`${this.props.match.path}?team=${idStr}`);
  }

  handleSearchInput(e) {
    this.setState({ search: e.target.value.toLowerCase() });
  }

  handleGenerationFilter(generations) {
    this.setState({ generations });
  }

  handleSpriteSelection(dataId) {
    console.log('CLICKED', dataId);
    this.updateTeamQueryString(this.state.currentTeamIds, dataId);
  }

  handleMembersUpdate(membersIds) {
    this.updateTeamQueryString(membersIds);
  }

  render() {
    const { search, generations, currentTeamIds } = this.state;
    const filterProps = {
      searchProps: {
        value: search,
        onChange: this.handleSearchInput
      },
      generationProps: {
        values: generations,
        options: TPU.generationOptions,
        onUpdate: this.handleGenerationFilter
      }
    };

    return (
      <PokedexContext.Consumer>
        {pokedex => (
          <div className="team-planner">
            <div
              className={classNames(
                'team-planner__container',
                'team-planner__container--width_20',
                'team-planner__container--hide-on_small'
              )}
            >
              <Filters hiddenOn={Strings.small} {...filterProps} />
            </div>
            <div className="team-planner__container team-planner__container--width_80">
              <Team
                members={TPU.selectMembersFromPokedex(pokedex, currentTeamIds)}
                onMembersUpdate={this.handleMembersUpdate}
              />
              <Filters hiddenOn={Strings.large} {...filterProps} />
              <List
                shouldWrap
                items={TPU.iteratePokedexToList(pokedex, {
                  currentTeamIds,
                  search
                })}
                itemTemplate={(item, i) => (
                  <Sprite
                    key={i}
                    data={item}
                    onClick={this.handleSpriteSelection}
                  />
                )}
              />
            </div>
          </div>
        )}
      </PokedexContext.Consumer>
    );
  }
}

export default PlannerPage;
