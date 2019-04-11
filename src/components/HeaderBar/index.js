import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Header, Image } from 'meiko-lib';
import NavigationMenu from './NavigationMenu';
import { createListeners, getWindowScrollPosition } from 'utils/common';
import Logo from 'assets/logo.png';

import './HeaderBar.scss';

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
        navRight={<NavigationMenu />}
      />
    );
  }
}

HeaderBar.propTypes = {
  pageTitle: PropTypes.string.isRequired
};

export default HeaderBar;
