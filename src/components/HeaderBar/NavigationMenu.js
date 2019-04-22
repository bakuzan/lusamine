import React from 'react';

import { DropdownMenu, useWindowSize, nano } from 'mko';
import { ButtonisedNavLink } from 'components/Buttons';
import Routes from 'constants/routes';
import { isXS } from 'utils/media';

const PLANNER = 'planner';
const POKEDEX = 'pokedex';
const SAVED_TEAMS = 'saved-teams';
const TRAINER_TEAMS = 'trainer-teams';
const SETTINGS = 'settings';

const savedTeamsUrl = `${Routes.base}${Routes.savedTeams}`;
const pokedexUrl = `${Routes.base}${Routes.pokedex}`;
const settingsUrl = `${Routes.base}${Routes.settings}`;
const trainerTeamsUrl = `${Routes.base}${Routes.trainerTeams}`;

function NavigationLinks({ onItemClick }) {
  return (
    <React.Fragment>
      <ButtonisedNavLink
        key={PLANNER}
        id={PLANNER}
        className="header-bar__link"
        exact
        to={Routes.base}
        onClick={onItemClick}
      >
        Team Planner
      </ButtonisedNavLink>
      <ButtonisedNavLink
        key={POKEDEX}
        id={POKEDEX}
        className="header-bar__link"
        to={pokedexUrl}
        onClick={onItemClick}
      >
        Pokedex
      </ButtonisedNavLink>
      <ButtonisedNavLink
        key={SAVED_TEAMS}
        id={SAVED_TEAMS}
        className="header-bar__link"
        to={savedTeamsUrl}
        onClick={onItemClick}
      >
        Saved Teams
      </ButtonisedNavLink>
      <ButtonisedNavLink
        key={TRAINER_TEAMS}
        id={TRAINER_TEAMS}
        className="header-bar__link"
        to={trainerTeamsUrl}
        onClick={onItemClick}
      >
        Trainer Teams
      </ButtonisedNavLink>
      <ButtonisedNavLink
        key={SETTINGS}
        id={SETTINGS}
        className="header-bar__link"
        to={settingsUrl}
        onClick={onItemClick}
      >
        Settings
      </ButtonisedNavLink>
    </React.Fragment>
  );
}

const menuIcon = '\u22EE';
const menuLabel = 'Open navigation menu';

// unintrusive centering
nano.put('.dropdown-menu', {
  padding: '6px'
});

function NavigationMenu() {
  const size = useWindowSize();

  if (isXS(size.width)) {
    return (
      <DropdownMenu
        align="right"
        icon={menuIcon}
        aria-label={menuLabel}
        title={menuLabel}
      >
        {(closeMenu) => <NavigationLinks onItemClick={closeMenu} />}
      </DropdownMenu>
    );
  }

  return <NavigationLinks />;
}

export default NavigationMenu;
