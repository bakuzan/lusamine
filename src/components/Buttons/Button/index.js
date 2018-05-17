import classNames from 'classnames';
import React from 'react';

import { Button as MButton } from 'meiko';
import './index.css';

export const Button = ({ className, ...props }) => (
  <MButton className={classNames('lusamine-button', className)} {...props} />
);

export const IconButton = ({ className, ...props }) => (
  <MButton
    className={classNames('lusamine-button', 'lusamine-icon-button', className)}
    {...props}
  />
);
