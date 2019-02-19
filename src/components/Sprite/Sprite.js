import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { useMemo } from 'react';

import { capitaliseEachWord } from 'utils/common';
import { buildSelectorsForSprite } from 'utils/selectors';
import { getDataFlags } from 'utils/derived-data';
import getBackgroundPosition from './getSpriteBackgroundPosition';
import './Sprite.scss';

const Sprite = React.memo(function(props) {
  const { data, onClick } = props;
  const flags = getDataFlags(data);
  const backgroundPosition = useMemo(
    () => getBackgroundPosition(flags, data),
    []
  );

  const spriteClasses = buildSelectorsForSprite(data);
  const hasClick = !!onClick;
  const spriteClick = hasClick ? () => onClick(data.id) : null;
  const capitalisedName = capitaliseEachWord(data.name);

  return (
    <li className={classNames('margin-one', 'sprite', spriteClasses.types)}>
      <button
        type="button"
        onClick={spriteClick}
        className={classNames(
          'sprite__pokemon',
          {
            'sprite__pokemon--mega': flags.isMega,
            'sprite__pokemon--variant': flags.isVariant,
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
