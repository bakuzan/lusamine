import classNames from 'classnames';
import React from 'react';

import { Button } from 'components/Buttons';
import Filters from 'components/Filters/Filters';
import Team from 'components/Team/Team';
import List from 'components/List/List';
import Sprite from 'components/Sprite/Sprite';
import { PokedexContext, TypeContext } from 'context';
import Constants from 'constants/index';
import {
  getUrlQueryStringAsObject,
  createSetFromIdString,
  createIdStringFromSet
} from 'utils/common';
import { getPartySizeAlertMessage } from 'utils/feedback';
import * as TPU from './TeamPlannerUtils';

import './TeamPlanner.css';

const { Strings, Party } = Constants;

class PlannerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTeamIds: createSetFromIdString(
        getUrlQueryStringAsObject(props.location).team
      ),
      search: '',
      generations: TPU.generationDefaults,
      types: TPU.typeDefaults,
      resists: TPU.typeDefaults,
      includeMega: true,
      includeVariants: true
    };

    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleMultiSelectFilter = this.handleMultiSelectFilter.bind(this);
    this.handleTickboxFilter = this.handleTickboxFilter.bind(this);
    this.handleSpriteSelection = this.handleSpriteSelection.bind(this);
    this.handleMembersUpdate = this.handleMembersUpdate.bind(this);
    this.handleClearTeam = this.handleClearTeam.bind(this);
    this.handleRandomTeam = this.handleRandomTeam.bind(this);
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

  handleMultiSelectFilter(value, name) {
    this.setState({ [name]: value });
  }

  handleTickboxFilter(e) {
    const { name, checked } = e.target;
    this.setState({ [name]: checked });
  }

  handleSpriteSelection(dataId) {
    if (this.state.currentTeamIds.size === Party.MAX_SIZE)
      return this.props.sendAlert(getPartySizeAlertMessage());
    console.log('CLICKED', dataId);
    this.updateTeamQueryString(this.state.currentTeamIds, dataId);
  }

  handleMembersUpdate(membersIds) {
    this.updateTeamQueryString(membersIds);
  }

  handleClearTeam() {
    this.updateTeamQueryString(new Set([]));
  }

  handleRandomTeam(dex) {
    return () => {
      const randomSetOfIds = TPU.selectRandomSetOfIds(dex);
      this.updateTeamQueryString(randomSetOfIds);
    };
  }

  render() {
    const dexFilters = { ...this.state };
    const filterProps = {
      searchProps: {
        value: dexFilters.search,
        onChange: this.handleSearchInput
      },
      generationProps: {
        values: dexFilters.generations,
        options: TPU.generationOptions,
        onUpdate: this.handleMultiSelectFilter
      },
      typeProps: {
        values: dexFilters.types,
        options: TPU.typeOptions,
        onUpdate: this.handleMultiSelectFilter
      },
      resistsProps: {
        values: dexFilters.resists,
        options: TPU.typeOptions,
        onUpdate: this.handleMultiSelectFilter
      },
      includeMegaProps: {
        checked: dexFilters.includeMega,
        onChange: this.handleTickboxFilter
      },
      includeVariantsProps: {
        checked: dexFilters.includeVariants,
        onChange: this.handleTickboxFilter
      }
    };
    console.log('Team planner state: ', this.state);
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
              <div className="team-planner__button-actions">
                <Button isAction onClick={this.handleRandomTeam(pokedex)}>
                  Randomise
                </Button>
                <Button isAction onClick={this.handleClearTeam}>
                  Clear team
                </Button>
              </div>
              <Team
                members={TPU.selectMembersFromPokedex(
                  pokedex,
                  this.state.currentTeamIds
                )}
                onMembersUpdate={this.handleMembersUpdate}
              />
              <Filters hiddenOn={Strings.large} {...filterProps} />
              <TypeContext.Consumer>
                {typeMatches => (
                  <List
                    className="team-planner__sprite-list"
                    shouldWrap
                    items={TPU.iteratePokedexToList(
                      pokedex,
                      dexFilters,
                      typeMatches
                    )}
                    itemTemplate={(item, i) => (
                      <Sprite
                        key={i}
                        data={item}
                        onClick={this.handleSpriteSelection}
                      />
                    )}
                  />
                )}
              </TypeContext.Consumer>
            </div>
          </div>
        )}
      </PokedexContext.Consumer>
    );
  }
}

export default PlannerPage;
