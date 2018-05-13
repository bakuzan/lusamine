import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { capitaliseEachWord } from 'utils/common';
import { buildSelectorsForSprite } from 'utils/selectors';
import './Sprite.css';

const Sprite = props => {
  console.log('SPRITE>', props);
  const spriteClasses = buildSelectorsForSprite(props.data);
  return (
    <li className={classNames('sprite', spriteClasses.types)}>
      <div
        className={classNames('sprite__pokemon', spriteClasses.name)}
        title={capitaliseEachWord(props.data.name)}
      />
    </li>
  );
};

Sprite.propTypes = {
  data: PropTypes.object.isRequired
};

export default Sprite;
