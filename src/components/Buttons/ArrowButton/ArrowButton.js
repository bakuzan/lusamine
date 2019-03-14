import classNames from 'classnames';
import React from 'react';

import { Icons } from 'meiko-lib';
import { IconButton } from 'components/Buttons/Button';
import './ArrowButton.scss';

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
