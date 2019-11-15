import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Header from 'meiko/Header';
import Image from 'meiko/Image';
import { useScrollPosition } from 'meiko/hooks/useScrollPosition';
import NavigationMenu from './NavigationMenu';

import Logo from 'assets/logo.png';

import './HeaderBar.scss';

const HeaderBar = React.memo(({ pageTitle }) => {
  const windowScrollPosition = useScrollPosition();

  const isPageScrolled = !!windowScrollPosition;
  const headerClasses = classNames('header-bar', {
    'header-bar--page-scrolled': isPageScrolled
  });

  return (
    <Header
      id="lusamine-header"
      className={headerClasses}
      leftAlignTitle
      title={pageTitle}
      navLeft={<Image className="logo" alt="Pokémon Logo" src={Logo} />}
      navRight={<NavigationMenu />}
    />
  );
});

HeaderBar.propTypes = {
  pageTitle: PropTypes.string.isRequired
};

export default HeaderBar;
