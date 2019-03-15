import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import './TypeBlock.scss';

const TypeBlock = React.memo(function TypeBlock(props) {
  return (
    <div
      className={classNames('type', `type--${props.value}`)}
      aria-label={`Type: ${props.value}`}
    />
  );
});

TypeBlock.propTypes = {
  value: PropTypes.string.isRequired
};

export default TypeBlock;
