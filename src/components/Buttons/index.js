import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { withButtonisation, Button as MButton, Icons } from 'mko';

import './Button.scss';

export const Button = ({ className, isAction, ...props }) => (
  <MButton
    className={classNames(
      'lusamine-button',
      { 'lusamine-button--action': isAction },
      className
    )}
    {...props}
  />
);

export const IconButton = ({ className, ...props }) => (
  <MButton
    className={classNames('lusamine-button', 'lusamine-icon-button', className)}
    {...props}
  />
);

export const ClearButton = ({ className, ...props }) => (
  <IconButton
    icon={Icons.cross}
    className={classNames('clear-button', className)}
    {...props}
  />
);

const ArrowButton = ({ className, help, ...props }) => (
  <IconButton
    className={classNames('arrow-button', className)}
    aria-label={help}
    title={help}
    {...props}
  />
);

export const LeftButton = (props) => (
  <ArrowButton {...props} icon={Icons.left} help="Move Left" />
);

export const RightButton = (props) => (
  <ArrowButton {...props} icon={Icons.right} help="Move Right" />
);

export const ButtonisedNavLink = withButtonisation(
  ({ className, ...props }) => (
    <NavLink
      className={classNames('lusamine-button-link', className)}
      {...props}
    />
  )
);
