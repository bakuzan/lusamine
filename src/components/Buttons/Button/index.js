import classNames from 'classnames';
import React from 'react';

import { Button as MButton } from 'meiko-lib';
import './index.scss';

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
