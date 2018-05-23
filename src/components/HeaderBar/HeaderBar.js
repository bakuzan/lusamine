import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Header, Image, Utils } from 'meiko';
import { ButtonisedNavLink } from 'components/Buttons';
import Logo from 'assets/logo.png';
import Routes from 'constants/routes';
import { getWindowScrollPosition } from 'utils/common';

import './HeaderBar.css';

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

    return (
      <Header
        id="lusamine-header"
        className={headerClasses}
        leftAlignTitle
        title={this.props.title}
        navLeft={<Image className="logo" alt="Pokémon Logo" src={Logo} />}
        navRight={
          <React.Fragment>
            <ButtonisedNavLink key="PLANNER" exact to={Routes.base}>
              Team Planner
            </ButtonisedNavLink>
            <ButtonisedNavLink key="SAVED" to={savedTeamsUrl}>
              Saved Teams
            </ButtonisedNavLink>
          </React.Fragment>
        }
      />
    );
  }
}

HeaderBar.propTypes = {
  title: PropTypes.string
};

export default HeaderBar;
