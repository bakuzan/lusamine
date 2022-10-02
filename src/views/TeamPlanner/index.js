import classNames from 'classnames';
import React, { useContext, useState } from 'react';

import generateUniqueId from 'ayaka/generateUniqueId';
import ClearableInput from 'meiko/ClearableInput';
import toasterService from 'meiko/utils/toasterService';
import MkoIcons from 'meiko/constants/icons';

import { Button } from 'components/Buttons';
import Filters from 'components/Filters';
import TeamPlannerGrid from './TeamPlannerGrid';
import Team from 'components/Team';
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
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const { Strings, Party, Routes } = Constants;

const resolvePokedex = (params) =>
  params.pokedexKey ||
  settingsStore.getKey('defaultPokedex') ||
  Pokedex.national;

function PlannerPage({ sendAlert }) {
  const pokeData = useContext(PokedexContext);
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const [state, setStateDumb] = useState({
    currentTeamName: '',
    search: '',
    generations: TPU.generationDefaults,
    types: TPU.typeDefaults,
    resists: TPU.typeDefaults,
    evolutions: TPU.evolutionDefaults,
    includeMega: true,
    includeVariants: true,
    startersOnly: false
  });

  function setState(obj) {
    setStateDumb((s) => ({ ...s, ...obj }));
  }

  function updateTeamQueryString(memberIds, newId) {
    const idStr = createIdStringFromSet(memberIds, newId);

    navigate(`${location.pathname}?team=${idStr}`);
  }

  function handleNameInput(e) {
    setState({ currentTeamName: e.target.value });
  }

  function handleSearchInput(e) {
    setState({ search: e.target.value.toLowerCase() });
  }

  function handleMultiSelectFilter(value, name) {
    setState({ [name]: value });
  }

  function handleTickboxFilter(e) {
    const { name, checked } = e.target;
    setState({ [name]: checked });
  }

  function handleSpriteSelection(dataId) {
    const currentTeamIds = createSetFromIdString(
      getUrlQueryStringAsObject(location).team
    );

    if (currentTeamIds.size === Party.MAX_SIZE) {
      return sendAlert(getPartySizeAlertMessage());
    }

    updateTeamQueryString(currentTeamIds, dataId);
  }

  function handleMembersUpdate(membersIds) {
    updateTeamQueryString(membersIds);
  }

  function handleClearTeam() {
    updateTeamQueryString(new Set([]));
  }

  function handleRandomTeam(dexData, typeMatches) {
    return () => {
      const idString = getUrlQueryStringAsObject(location).team;
      const currentTeamIds = createSetFromIdString(idString);
      const activePokedex = resolvePokedex(params);
      const filters = { ...state, currentTeamIds, activePokedex };

      const randomSetOfIds = TPU.selectRandomSetOfIds(
        dexData,
        filters,
        typeMatches
      );

      updateTeamQueryString(randomSetOfIds);
    };
  }

  function handleSaveTeam() {
    const idString = getUrlQueryStringAsObject(location).team;
    const currentTeamIds = createSetFromIdString(idString);

    if (currentTeamIds.size === 0) {
      return;
    }

    const teamId = generateUniqueId();
    const teamName = state.currentTeamName || 'Team';

    const saveTeamData = {
      [teamId]: {
        name: teamName,
        idString
      }
    };

    teamsStore.set(saveTeamData);
    toasterService.success(
      'Team saved.',
      `${teamName} has been persisted locally.`
    );
  }

  function handleChangePokedex(e) {
    const { value } = e.target;
    navigate(`${Routes.base}/${value}`);
  }

  const { team } = getUrlQueryStringAsObject(location);
  const activePokedex = resolvePokedex(params);
  const currentTeamIds = createSetFromIdString(team);
  const dexFilters = { ...state, currentTeamIds, activePokedex };

  const filterProps = {
    pokedexProps: {
      value: activePokedex,
      onChange: handleChangePokedex
    },
    searchProps: {
      value: dexFilters.search,
      onChange: handleSearchInput
    },
    generationProps: {
      values: dexFilters.generations,
      options: TPU.generationOptions,
      onUpdate: handleMultiSelectFilter
    },
    typeProps: {
      values: dexFilters.types,
      options: TPU.typeOptions,
      onUpdate: handleMultiSelectFilter
    },
    resistsProps: {
      values: dexFilters.resists,
      options: TPU.typeOptions,
      onUpdate: handleMultiSelectFilter
    },
    evolutionsProps: {
      values: dexFilters.evolutions,
      options: TPU.evolutionOptions,
      onUpdate: handleMultiSelectFilter
    },
    includeMegaProps: {
      checked: dexFilters.includeMega,
      onChange: handleTickboxFilter
    },
    includeVariantsProps: {
      checked: dexFilters.includeVariants,
      onChange: handleTickboxFilter
    },
    startersOnlyProps: {
      checked: dexFilters.startersOnly,
      onChange: handleTickboxFilter
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
        <Filters hiddenOn={[Strings.xsmall, Strings.small]} {...filterProps} />
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
                  id="jump-to-options"
                  className="scroll-to-filters"
                  isAction
                  icon={MkoIcons.down}
                  title="Scroll down to options"
                  aria-label="Scroll down to options"
                  onClick={() => {
                    const rect = document
                      .getElementById('scroll-down-anchor')
                      .getBoundingClientRect();

                    window.scrollTo(0, rect.top ?? 0);
                  }}
                />
                <Button
                  id="randomise-team"
                  isAction
                  onClick={handleRandomTeam(pokeData, typeMatches)}
                >
                  Randomise
                </Button>
                <Button id="save-team" isAction onClick={handleSaveTeam}>
                  Save team
                </Button>
                <Button id="clear-team" isAction onClick={handleClearTeam}>
                  Clear team
                </Button>
              </div>
              <p id="teamCreatorDescription" className="for-screenreader-only">
                Create a savable pokemon team with a custom name. Drag and drop
                or use the direction arrows to reorder team members. Individual
                pokemon can be evolved or devolved using the evolution button
                between the reorder buttons.
              </p>
              <div
                className="team-planner__team-creator"
                aria-describedby="teamCreatorDescription"
              >
                <ClearableInput
                  id="current-team-name"
                  name="currentTeamName"
                  label="Team Name"
                  value={state.currentTeamName}
                  onChange={handleNameInput}
                />
                <Team
                  types={typeMatches}
                  members={selectMembersFromPokedex(
                    pokeData.pokedex,
                    currentTeamIds
                  )}
                  onMembersUpdate={handleMembersUpdate}
                />
              </div>
              <div id="scroll-down-anchor"></div>
              <Filters hiddenOn={Strings.large} {...filterProps} />

              <TeamPlannerGrid
                items={filteredSprites}
                onItemClick={handleSpriteSelection}
              />
            </div>
          );
        }}
      </TypeContext.Consumer>
    </div>
  );
}

export default PlannerPage;
