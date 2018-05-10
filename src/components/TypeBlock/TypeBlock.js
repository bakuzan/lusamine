import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import './TypeBlock.css';

const TypeBlock = props => <div className={classNames('type', props.value)} />;

TypeBlock.propTypes = {
  value: PropTypes.string.isRequired
};

export default TypeBlock;
