/* eslint-disable react/prop-types */
import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { withButtonisation, Button as MButton } from 'meiko/Button';
import Icons from 'meiko/constants/icons';

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

const ArrowButton = ({ className, help, unrounded, ...props }) => (
  <IconButton
    className={classNames(
      'arrow-button',
      { 'arrow-button--square': unrounded },
      className
    )}
    aria-label={help}
    title={help}
    {...props}
  />
);

export const LeftButton = (props) => (
  <ArrowButton {...props} icon={Icons.left} help="Move left" />
);

export const RightButton = (props) => (
  <ArrowButton {...props} icon={Icons.right} help="Move right" />
);

export const UpButton = (props) => (
  <ArrowButton
    {...props}
    icon={Icons.up}
    className="arrow-button--up"
    help="Move up"
    unrounded
  />
);

export const DownButton = (props) => (
  <ArrowButton
    {...props}
    icon={Icons.down}
    className="arrow-button--down"
    help="Move down"
    unrounded
  />
);

export const ButtonisedNavLink = withButtonisation(
  ({ className, ...props }) => (
    <NavLink
      className={classNames('lusamine-button-link', className)}
      {...props}
    />
  )
);
