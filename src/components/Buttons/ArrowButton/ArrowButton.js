import classNames from 'classnames';
import React from 'react';

import { Constants } from 'meiko';
import { IconButton } from 'components/Buttons/Button';
import './ArrowButton.css';

const { Icons } = Constants;

const ArrowButton = ({ className, ...props }) => (
  <IconButton className={classNames('arrow-button', className)} {...props} />
);

export const LeftButton = props => <ArrowButton {...props} icon={Icons.left} />;

export const RightButton = props => (
  <ArrowButton {...props} icon={Icons.right} />
);
