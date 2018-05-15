import React from 'react';

import Filters from 'components/Filters/Filters';
import Team from 'components/Team/Team';
import List from 'components/List/List';
import Sprite from 'components/Sprite/Sprite';
import { PokedexContext } from 'context';
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
      search: '',
      currentTeamIds: createSetFromIdString(
        getUrlQueryStringAsObject(props.location).team
      )
    };

    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleSpriteSelection = this.handleSpriteSelection.bind(this);
  }

  componentDidUpdate(prevProps) {
    const queryObject = getUrlQueryStringAsObject(this.props.location);
    const currentIds = createIdStringFromSet(this.state.currentTeamIds);
    if ((currentIds || queryObject.team) && queryObject.team !== currentIds) {
      console.log('UPDATED', 'qo:', queryObject, 'ids: ', typeof currentIds);
      this.setState({
        currentTeamIds: createSetFromIdString(queryObject.team)
      });
    }
  }

  handleSearchInput(e) {
    this.setState({ search: e.target.value.toLowerCase() });
  }

  handleSpriteSelection(dataId) {
    console.log('CLICKED', dataId);
    const idStr = createIdStringFromSet(this.state.currentTeamIds, dataId);
    this.props.history.push(`${this.props.match.path}?team=${idStr}`);
  }

  render() {
    const { search, currentTeamIds } = this.state;
    const searchProps = {
      value: search,
      onChange: this.handleSearchInput
    };

    return (
      <PokedexContext.Consumer>
        {pokedex => (
          <div className="team-planner">
            <div className="team-planner__container team-planner__container--width_20">
              <Filters searchProps={searchProps} />
            </div>
            <div className="team-planner__container team-planner__container--width_80">
              <Team
                members={TPU.selectMembersFromPokedex(pokedex, currentTeamIds)}
              />
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
