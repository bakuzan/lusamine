import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Header, Image, Utils } from 'meiko';
import Logo from 'assets/logo.png';
import { getWindowScrollPosition } from 'utils/common';

import './HeaderBar.css';

class HeaderBar extends React.PureComponent {
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
    const isPageScrolled = !!this.state.windowScrollPosition;
    const headerClasses = classNames('header-bar', {
      'header-bar--page-scrolled': isPageScrolled
    });

    return (
      <Header
        className={headerClasses}
        leftAlignTitle
        title={this.props.title}
        navLeft={<Image className="logo" alt="Pokémon Logo" src={Logo} />}
      />
    );
  }
}

HeaderBar.propTypes = {
  title: PropTypes.string
};

export default HeaderBar;
