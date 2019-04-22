import classNames from 'classnames';
import React from 'react';

import { Grid, ClearableInput } from 'mko';
import { Button } from 'components/Buttons';
import Filters from 'components/Filters';
import Team from 'components/Team';
import Sprite from 'components/Sprite';
import { PokedexContext, TypeContext } from 'context';
import Constants from 'constants/index';
import {
  getUrlQueryStringAsObject,
  combineValuesIntoSet,
  createSetFromIdString,
  createIdStringFromSet,
  generateUniqueId,
  selectMembersFromPokedex,
  teamsStore
} from 'utils/common';
import { getPartySizeAlertMessage } from 'utils/feedback';
import * as TPU from './TeamPlannerUtils';

import './TeamPlanner.scss';

const { Strings, Party } = Constants;

class PlannerPage extends React.Component {
  static contextType = PokedexContext;

  constructor(props) {
    super(props);
    this.state = {
      currentTeamName: '',
      currentTeamIds: createSetFromIdString(
        getUrlQueryStringAsObject(props.location).team
      ),
      search: '',
      generations: TPU.generationDefaults,
      types: TPU.typeDefaults,
      resists: TPU.typeDefaults,
      evolutions: TPU.evolutionDefaults,
      includeMega: true,
      includeVariants: true
    };

    this.handleNameInput = this.handleNameInput.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleMultiSelectFilter = this.handleMultiSelectFilter.bind(this);
    this.handleTickboxFilter = this.handleTickboxFilter.bind(this);
    this.handleSpriteSelection = this.handleSpriteSelection.bind(this);
    this.handleMembersUpdate = this.handleMembersUpdate.bind(this);
    this.handleClearTeam = this.handleClearTeam.bind(this);
    this.handleRandomTeam = this.handleRandomTeam.bind(this);
    this.handleSaveTeam = this.handleSaveTeam.bind(this);
  }

  updateTeamQueryString(memberIds, newId) {
    const { match, history } = this.props;
    const idStr = createIdStringFromSet(memberIds, newId);
    const newTeamIds = combineValuesIntoSet(memberIds, newId);

    this.setState({ currentTeamIds: newTeamIds }, () =>
      history.push(`${match.path}?team=${idStr}`)
    );
  }

  handleNameInput(e) {
    this.setState({ currentTeamName: e.target.value });
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
    if (this.state.currentTeamIds.size === Party.MAX_SIZE) {
      return this.props.sendAlert(getPartySizeAlertMessage());
    }

    this.updateTeamQueryString(this.state.currentTeamIds, dataId);
  }

  handleMembersUpdate(membersIds) {
    this.updateTeamQueryString(membersIds);
  }

  handleClearTeam() {
    this.updateTeamQueryString(new Set([]));
  }

  handleRandomTeam(dex, typeMatches) {
    return () => {
      const filters = { ...this.state };
      const randomSetOfIds = TPU.selectRandomSetOfIds(
        dex,
        filters,
        typeMatches
      );

      this.updateTeamQueryString(randomSetOfIds);
    };
  }

  handleSaveTeam() {
    if (this.state.currentTeamIds.size === 0) {
      return;
    }

    const teamId = generateUniqueId();
    const saveTeamData = {
      [teamId]: {
        name: this.state.currentTeamName,
        idString: createIdStringFromSet(this.state.currentTeamIds)
      }
    };

    teamsStore.set(saveTeamData);
  }

  render() {
    let pokedex = this.context;
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
      evolutionsProps: {
        values: dexFilters.evolutions,
        options: TPU.evolutionOptions,
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

    return (
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
        <TypeContext.Consumer>
          {(typeMatches) => {
            const filteredSprites = TPU.iteratePokedexToList(
              pokedex,
              dexFilters,
              typeMatches
            );

            return (
              <div className="team-planner__container team-planner__container--width_80">
                <div className="team-planner__button-actions">
                  <Button
                    id="randomise-team"
                    isAction
                    onClick={this.handleRandomTeam(pokedex, typeMatches)}
                  >
                    Randomise
                  </Button>
                  <Button id="save-team" isAction onClick={this.handleSaveTeam}>
                    Save team
                  </Button>
                  <Button
                    id="clear-team"
                    isAction
                    onClick={this.handleClearTeam}
                  >
                    Clear team
                  </Button>
                </div>
                <div className="team-planner__team-creator">
                  <ClearableInput
                    id="current-team-name"
                    name="currentTeamName"
                    label="Team Name"
                    value={this.state.currentTeamName}
                    onChange={this.handleNameInput}
                  />
                  <Team
                    types={typeMatches}
                    members={selectMembersFromPokedex(
                      pokedex,
                      this.state.currentTeamIds
                    )}
                    onMembersUpdate={this.handleMembersUpdate}
                  />
                </div>
                <Filters hiddenOn={Strings.large} {...filterProps} />
                {!!filteredSprites.length && (
                  <Grid
                    className="team-planner__sprite-list"
                    items={filteredSprites}
                  >
                    {(item) => (
                      <Sprite
                        key={item.id}
                        data={item}
                        onClick={this.handleSpriteSelection}
                      />
                    )}
                  </Grid>
                )}
                {!filteredSprites.length && (
                  <div>No pokemon available for the current filters.</div>
                )}
              </div>
            );
          }}
        </TypeContext.Consumer>
      </div>
    );
  }
}

export default PlannerPage;
