import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { capitaliseEachWord } from 'utils/common';
import { buildSelectorsForSprite } from 'utils/selectors';
import './Sprite.css';

class Sprite extends React.PureComponent {
  render() {
    const { data, onClick } = this.props;
    const spriteClasses = buildSelectorsForSprite(data);
    const hasClick = !!onClick;
    const spriteClick = hasClick ? () => onClick(data.id) : null;

    return (
      <li className={classNames('margin-one', 'sprite', spriteClasses.types)}>
        <button
          type="button"
          onClick={spriteClick}
          className={classNames('sprite__pokemon', spriteClasses.name, {
            'sprite__pokemon--can-click': hasClick
          })}
          title={capitaliseEachWord(data.name)}
        />
      </li>
    );
  }
}

Sprite.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default Sprite;
