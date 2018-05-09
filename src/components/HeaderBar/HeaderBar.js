import React from 'react';
import { Header, Image } from 'meiko';
import Logo from 'assets/logo.png';
import './HeaderBar.css';

const HeaderBar = props => {
  return (
    <Header
      className="header-bar"
      leftAlignTitle
      title={props.title}
      navLeft={<Image className="logo" alt="Pokemon Logo" src={Logo} />}
    />
  );
};

export default HeaderBar;
