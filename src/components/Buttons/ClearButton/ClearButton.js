import classNames from 'classnames';
import React from 'react';

import { Constants } from 'meiko';
import { IconButton } from 'components/Buttons/Button';
import './ClearButton.css';

const { Icons } = Constants;

const ClearButton = ({ className, ...props }) => (
  <IconButton
    icon={Icons.cross}
    className={classNames('clear-button', className)}
    {...props}
  />
);

export default ClearButton;
