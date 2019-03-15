import classNames from 'classnames';
import React from 'react';

import { Icons } from 'meiko-lib';
import { IconButton } from 'components/Buttons/Button';
import './ClearButton.scss';

const ClearButton = ({ className, ...props }) => (
  <IconButton
    icon={Icons.cross}
    className={classNames('clear-button', className)}
    {...props}
  />
);

export default ClearButton;
