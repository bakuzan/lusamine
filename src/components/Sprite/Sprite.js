import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { Utils } from 'meiko';
import buildSelectorsForPokemon from 'utils/selectors';
import './Sprite.css';

const Sprite = props => {
  console.log('SPRITE>', props);
  const spriteClasses = buildSelectorsForPokemon(props.data);
  return (
    <li className={classNames('sprite', spriteClasses.types)}>
      <div
        className={classNames('sprite__pokemon', spriteClasses.name)}
        title={Utils.Common.capitalise(props.data.name)}
      />
    </li>
  );
};

Sprite.propTypes = {
  data: PropTypes.object.isRequired
};

export default Sprite;
