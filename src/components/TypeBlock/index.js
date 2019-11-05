import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import './TypeBlock.scss';

const TypeBlock = React.memo(function TypeBlock(props) {
  return (
    <div
      className={classNames('type', `type--${props.value}`, {
        'type--center': props.center
      })}
      aria-label={`Type: ${props.value}`}
    />
  );
});

TypeBlock.defaultProps = {
  center: false
};

TypeBlock.propTypes = {
  value: PropTypes.string.isRequired,
  center: PropTypes.bool
};

export default TypeBlock;
