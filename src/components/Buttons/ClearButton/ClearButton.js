import classNames from 'classnames';
import React from 'react';

import { Button, Constants } from 'meiko';
import './ClearButton.css';

const { Icons } = Constants;

const ClearButton = ({ className, ...props }) => (
  <Button
    icon={Icons.cross}
    className={classNames('lusamine-button', 'clear-button', className)}
    {...props}
  />
);

export default ClearButton;
