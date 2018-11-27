import { NavLink } from 'react-router-dom';

import { withButtonisation, withCustomButtonWrapper } from 'meiko-lib';

import * as LusamineButton from './Button';
import clear_button from './ClearButton/ClearButton';
import * as ArrowButton from './ArrowButton/ArrowButton';

export const Button = LusamineButton.Button;
export const IconButton = LusamineButton.IconButton;
export const ClearButton = clear_button;
export const LeftButton = ArrowButton.LeftButton;
export const RightButton = ArrowButton.RightButton;

export const ButtonisedNavLink = withCustomButtonWrapper(
  withButtonisation(NavLink),
  { className: 'lusamine-button-link', link: true }
);
