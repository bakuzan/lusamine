import React from 'react';

import Filters from 'components/Filters/Filters';
import Team from 'components/Team/Team';
import List from 'components/List/List';
import Sprite from 'components/Sprite/Sprite';
import { PokedexContext } from 'context';

import './TeamPlanner.css';

function iteratePokedexToList(dex, filters) {
  const exclusions = filters.currentTeamIds;
  return Array.from(dex).reduce((acc, [id, item]) => {
    if (exclusions.has(id)) return acc;
    return [...acc, item];
  }, []);
}

function selectMembersFromPokedex(dex, memberIds) {
  return Array.from(memberIds).map(id => dex.get(id));
}

class PlannerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      currentTeamIds: new Set([])
    };

    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleSpriteSelection = this.handleSpriteSelection.bind(this);
  }

  handleSearchInput(e) {
    this.setState({ search: e.target.value });
  }

  handleSpriteSelection(dataId) {
    this.setState(prev => ({
      currentTeamIds: prev.currentTeamIds.add(dataId)
    }));
  }

  render() {
    const { currentTeamIds } = this.state;
    const searchProps = {
      value: this.state.search,
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
                members={selectMembersFromPokedex(pokedex, currentTeamIds)}
              />
              <List
                shouldWrap
                items={iteratePokedexToList(pokedex, {
                  currentTeamIds
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
