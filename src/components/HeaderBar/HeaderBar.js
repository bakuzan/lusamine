import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Header, Image, Utils } from 'meiko';
import { ButtonisedNavLink } from 'components/Buttons';
import Logo from 'assets/logo.png';
import Strings from 'constants/strings';
import Routes from 'constants/routes';
import { getWindowScrollPosition } from 'utils/common';

import './HeaderBar.css';

const PLANNER = 'planner';
const SAVED_TEAMS = 'saved-teams';
const getPageTitleForCurrentPath = path =>
  path.includes(SAVED_TEAMS)
    ? Strings.pageTitle.savedTeams
    : Strings.pageTitle.planner;

class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowScrollPosition: 0
    };
  }

  componentDidMount() {
    this.scrollListeners = Utils.Common.createListeners('scroll', () => {
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
    const isPageScrolled = !!this.state.windowScrollPosition;
    const headerClasses = classNames('header-bar', {
      'header-bar--page-scrolled': isPageScrolled
    });
    const pageTitle = getPageTitleForCurrentPath(this.props.currentPath);

    return (
      <Header
        id="lusamine-header"
        className={headerClasses}
        leftAlignTitle
        title={pageTitle}
        navLeft={<Image className="logo" alt="Pokémon Logo" src={Logo} />}
        navRight={
          <React.Fragment>
            <ButtonisedNavLink key={PLANNER} exact to={Routes.base}>
              Team Planner
            </ButtonisedNavLink>
            <ButtonisedNavLink key={SAVED_TEAMS} to={savedTeamsUrl}>
              Saved Teams
            </ButtonisedNavLink>
          </React.Fragment>
        }
      />
    );
  }
}

HeaderBar.propTypes = {
  currentPath: PropTypes.string.isRequired
};

export default HeaderBar;
