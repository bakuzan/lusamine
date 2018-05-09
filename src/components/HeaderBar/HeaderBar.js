import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Header, Image } from 'meiko';
import Logo from 'assets/logo.png';
import './HeaderBar.css';

const HeaderBar = props => {
  const headerClasses = classNames('header-bar', {
    'header-bar--page-scrolled': props.isPageScrolled
  });

  return (
    <Header
      className={headerClasses}
      leftAlignTitle
      title={props.title}
      navLeft={<Image className="logo" alt="Pokémon Logo" src={Logo} />}
    />
  );
};

HeaderBar.propTypes = {
  isPageScrolled: PropTypes.bool,
  title: PropTypes.string
};

export default HeaderBar;
