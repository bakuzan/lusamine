import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Header, Image, createListeners } from 'meiko-lib';
import { ButtonisedNavLink } from 'components/Buttons';
import Logo from 'assets/logo.png';

import Routes from 'constants/routes';
import { getWindowScrollPosition } from 'utils/common';

import './HeaderBar.scss';

const PLANNER = 'planner';
const SAVED_TEAMS = 'saved-teams';
const SETTINGS = 'settings';

class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowScrollPosition: 0
    };
  }

  componentDidMount() {
    this.scrollListeners = createListeners('scroll', () => {
      const windowScrollPosition = getWindowScrollPosition();
      if (windowScrollPosition !== this.state.windowScrollPosition) {
        this.setState({ windowScrollPosition });
      }
    })();
    this.scrollListeners.listen();
  }

  componentWillUnmount() {
    this.scrollListeners.remove();
  }

  render() {
    const savedTeamsUrl = `${Routes.base}${Routes.savedTeams}`;
    const settingsUrl = `${Routes.base}${Routes.settings}`;

    const isPageScrolled = !!this.state.windowScrollPosition;
    const headerClasses = classNames('header-bar', {
      'header-bar--page-scrolled': isPageScrolled
    });

    return (
      <Header
        id="lusamine-header"
        className={headerClasses}
        leftAlignTitle
        title={this.props.pageTitle}
        navLeft={<Image className="logo" alt="Pokémon Logo" src={Logo} />}
        navRight={
          <React.Fragment>
            <ButtonisedNavLink
              key={PLANNER}
              id={PLANNER}
              exact
              to={Routes.base}
            >
              Team Planner
            </ButtonisedNavLink>
            <ButtonisedNavLink
              key={SAVED_TEAMS}
              id={SAVED_TEAMS}
              to={savedTeamsUrl}
            >
              Saved Teams
            </ButtonisedNavLink>
            <ButtonisedNavLink key={SETTINGS} id={SETTINGS} to={settingsUrl}>
              Settings
            </ButtonisedNavLink>
          </React.Fragment>
        }
      />
    );
  }
}

HeaderBar.propTypes = {
  pageTitle: PropTypes.string.isRequired
};

export default HeaderBar;
