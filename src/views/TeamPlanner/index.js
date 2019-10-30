import classNames from 'classnames';
import React from 'react';

import generateUniqueId from 'ayaka/generateUniqueId';
import { Grid, ClearableInput } from 'mko';
import { Button } from 'components/Buttons';
import Filters from 'components/Filters';
import Team from 'components/Team';
import Sprite from 'components/Sprite';
import { PokedexContext, TypeContext } from 'context';
import Constants from 'constants/index';
import { Pokedex } from 'constants/pokedex';
import {
  getUrlQueryStringAsObject,
  createSetFromIdString,
  createIdStringFromSet,
  selectMembersFromPokedex,
  teamsStore,
  settingsStore
} from 'utils/common';
import { getPartySizeAlertMessage } from 'utils/feedback';
import * as TPU from './TeamPlannerUtils';

import './TeamPlanner.scss';

const { Strings, Party, Routes } = Constants;

const resolvePokedex = (m) =>
  m.params.pokedexKey ||
  settingsStore.getKey('defaultPokedex') ||
  Pokedex.national;

class PlannerPage extends React.Component {
  static contextType = PokedexContext;

  constructor(props) {
    super(props);
    this.state = {
      currentTeamName: '',
      search: '',
      generations: TPU.generationDefaults,
      types: TPU.typeDefaults,
      resists: TPU.typeDefaults,
      evolutions: TPU.evolutionDefaults,
      includeMega: true,
      includeVariants: true,
      startersOnly: false
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
    this.handleChangePokedex = this.handleChangePokedex.bind(this);
  }

  updateTeamQueryString(memberIds, newId) {
    const { location, history } = this.props;
    const idStr = createIdStringFromSet(memberIds, newId);

    history.push(`${location.pathname}?team=${idStr}`);
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
    const currentTeamIds = createSetFromIdString(
      getUrlQueryStringAsObject(this.props.location).team
    );
    if (currentTeamIds.size === Party.MAX_SIZE) {
      return this.props.sendAlert(getPartySizeAlertMessage());
    }

    this.updateTeamQueryString(currentTeamIds, dataId);
  }

  handleMembersUpdate(membersIds) {
    this.updateTeamQueryString(membersIds);
  }

  handleClearTeam() {
    this.updateTeamQueryString(new Set([]));
  }

  handleRandomTeam(dexData, typeMatches) {
    return () => {
      const idString = getUrlQueryStringAsObject(this.props.location).team;
      const currentTeamIds = createSetFromIdString(idString);
      const activePokedex = resolvePokedex(this.props.match);
      const filters = { ...this.state, currentTeamIds, activePokedex };

      const randomSetOfIds = TPU.selectRandomSetOfIds(
        dexData,
        filters,
        typeMatches
      );

      this.updateTeamQueryString(randomSetOfIds);
    };
  }

  handleSaveTeam() {
    const idString = getUrlQueryStringAsObject(this.props.location).team;
    const currentTeamIds = createSetFromIdString(idString);
    if (currentTeamIds.size === 0) {
      return;
    }

    const teamId = generateUniqueId();
    const saveTeamData = {
      [teamId]: {
        name: this.state.currentTeamName,
        idString
      }
    };

    teamsStore.set(saveTeamData);
  }

  handleChangePokedex(e) {
    const { value } = e.target;
    this.props.history.push(`${Routes.base}/${value}`);
  }

  render() {
    let pokeData = this.context;
    const { location, match } = this.props;
    const activePokedex = resolvePokedex(match);
    const { team } = getUrlQueryStringAsObject(location);
    const currentTeamIds = createSetFromIdString(team);

    const dexFilters = { ...this.state, currentTeamIds, activePokedex };

    const filterProps = {
      pokedexProps: {
        value: activePokedex,
        onChange: this.handleChangePokedex
      },
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
      },
      startersOnlyProps: {
        checked: dexFilters.startersOnly,
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
              pokeData,
              dexFilters,
              typeMatches
            );

            return (
              <div className="team-planner__container team-planner__container--width_80">
                <p id="actionsDescription" className="for-screenreader-only">
                  Here are actions applicaable to the team creator. You can
                  randomise the team creator members selecting from those
                  available under the current filters, save the current team to
                  the teams tab, or clear all the current team members.
                </p>
                <div
                  className="team-planner__button-actions"
                  aria-describedby="actionsDescription"
                >
                  <Button
                    id="randomise-team"
                    isAction
                    onClick={this.handleRandomTeam(pokeData, typeMatches)}
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
                <p
                  id="teamCreatorDescription"
                  className="for-screenreader-only"
                >
                  Create a savable pokemon team with a custom name. Drag and
                  drop or use the direction arrows to reorder team members.
                  Individual pokemon can be evolved or devolved using the
                  evolution button between the reorder buttons.
                </p>
                <div
                  className="team-planner__team-creator"
                  aria-describedby="teamCreatorDescription"
                >
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
                      pokeData.pokedex,
                      currentTeamIds
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
