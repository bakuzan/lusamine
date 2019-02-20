import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { capitaliseEachWord } from 'utils/common';
import { buildSelectorsForSprite } from 'utils/selectors';

import './Sprite.scss';

const Sprite = React.memo(function(props) {
  const { data, onClick } = props;
  const backgroundPosition = data.spritePosition;

  const spriteClasses = buildSelectorsForSprite(data);
  const hasClick = !!onClick;
  const spriteClick = hasClick ? () => onClick(data.id) : null;
  const capitalisedName = capitaliseEachWord(
    `${data.name}${data.form ? ` (${capitaliseEachWord(data.form)})` : ''}`
  );

  return (
    <li className={classNames('margin-one', 'sprite', spriteClasses.types)}>
      <button
        type="button"
        onClick={spriteClick}
        id={`sprite-${data.id}`}
        className={classNames(
          'sprite__pokemon',
          {
            'sprite__pokemon--can-click': hasClick
          },
          spriteClasses.name
        )}
        style={backgroundPosition}
        aria-label={capitalisedName}
        title={capitalisedName}
      />
    </li>
  );
});

Sprite.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default Sprite;
