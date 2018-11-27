import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import './TypeBlock.scss';

const TypeBlock = (props) => (
  <div className={classNames('type', `type--${props.value}`)} />
);

TypeBlock.propTypes = {
  value: PropTypes.string.isRequired
};

export default TypeBlock;
