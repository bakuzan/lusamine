import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

const Sprite = props => {
  console.log('SPRITE>', props);
  return <div className={classNames('sprite')} />;
};

Sprite.propTypes = {
  data: PropTypes.object.isRequired
};

export default Sprite;
