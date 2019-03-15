import React from 'react';
import { NavLink } from 'react-router-dom';

import { withButtonisation, withCustomButtonWrapper } from 'meiko-lib';

import * as LusamineButton from './Button';
import clear_button from './ClearButton';
import * as ArrowButton from './ArrowButton';

export const Button = LusamineButton.Button;
export const IconButton = LusamineButton.IconButton;
export const ClearButton = clear_button;
export const LeftButton = ArrowButton.LeftButton;
export const RightButton = ArrowButton.RightButton;

export const ButtonisedNavLink = withCustomButtonWrapper(
  withButtonisation(({ link, ...props }) => <NavLink {...props} />),
  { className: 'lusamine-button-link', link: true }
);
