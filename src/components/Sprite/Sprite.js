import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { capitaliseEachWord } from 'utils/common';
import { buildSelectorsForSprite } from 'utils/selectors';
import './Sprite.css';

const Sprite = props => {
  const spriteClasses = buildSelectorsForSprite(props.data);
  const hasClick = !!props.onClick;
  return (
    <li className={classNames('margin-one', 'sprite', spriteClasses.types)}>
      <button
        type="button"
        onClick={() => props.onClick(props.data.id)}
        className={classNames('sprite__pokemon', spriteClasses.name, {
          'sprite__pokemon--can-click': hasClick
        })}
        title={capitaliseEachWord(props.data.name)}
      />
    </li>
  );
};

Sprite.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default Sprite;
