import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

const TypeBlock = props => <div className={classNames('type', props.value)} />;

TypeBlock.propTypes = {
  value: PropTypes.string.isRequired
};

export default TypeBlock;
