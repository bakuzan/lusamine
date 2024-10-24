import PropTypes from 'prop-types';
import React from 'react';

import DropdownMenu from 'meiko/DropdownMenu';
import { nano } from 'meiko/styles/nano';
import { useWindowSize } from 'meiko/hooks/useWindowSize';
import { ButtonisedNavLink } from 'components/Buttons';
import Routes from 'constants/routes';
import { isXS } from 'utils/media';

const PLANNER = 'planner';
const POKEDEX = 'pokedex';
const TEAMS = 'teams';
const SETTINGS = 'settings';

const teamsUrl = `${Routes.base}${Routes.teams}`;
const pokedexUrl = `${Routes.base}${Routes.pokedex}`;
const settingsUrl = `${Routes.base}${Routes.settings}`;

function NavigationLinks({ onItemClick }) {
  return (
    <React.Fragment>
      <ButtonisedNavLink
        key={PLANNER}
        id={PLANNER}
        className="header-bar__link"
        end
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
        key={TEAMS}
        id={TEAMS}
        className="header-bar__link"
        to={teamsUrl}
        onClick={onItemClick}
      >
        Teams
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

NavigationLinks.propTypes = {
  onItemClick: PropTypes.func
};

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
        {(closeMenu) => {
          return <NavigationLinks onItemClick={closeMenu} />;
        }}
      </DropdownMenu>
    );
  }

  return <NavigationLinks />;
}

export default NavigationMenu;
