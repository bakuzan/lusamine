import classNames from 'classnames';
import React from 'react';

import { Icons } from 'meiko-lib';
import { IconButton } from 'components/Buttons/Button';
import './ArrowButton.scss';

const ArrowButton = ({ className, ...props }) => (
  <IconButton className={classNames('arrow-button', className)} {...props} />
);

export const LeftButton = (props) => (
  <ArrowButton {...props} icon={Icons.left} />
);

export const RightButton = (props) => (
  <ArrowButton {...props} icon={Icons.right} />
);
