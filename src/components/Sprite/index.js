import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { capitaliseEachWord } from 'ayaka/capitalise';
import Tooltip from './Tooltip';

import { buildSelectorsForSprite } from 'utils/selectors';

import './Sprite.scss';

const Sprite = React.memo(function(props) {
  const { data, onClick } = props;
  const backgroundPosition = data.spritePosition;

  const spriteId = `sprite-${data.id}`;
  const spriteClasses = buildSelectorsForSprite(data);
  const hasClick = !!onClick;
  const spriteClick = hasClick ? () => onClick(data.id) : null;
  const capitalisedName = capitaliseEachWord(
    `${data.name}${data.form ? ` (${capitaliseEachWord(data.form)})` : ''}`
  );

  return (
    <div className={classNames('margin-one', 'sprite', spriteClasses.types)}>
      <p id={`describe_${spriteId}`} className="for-screenreader-only">
        Click {capitalisedName} to add as a current team member.
      </p>
      <Tooltip
        contentId={`tooltip_${spriteId}`}
        className="sprite__tooltip"
        usePosition="above"
        attachTo="main"
        delay={500}
        text={capitalisedName}
        center
      >
        <button
          type="button"
          onClick={spriteClick}
          id={spriteId}
          className={classNames(
            'sprite__pokemon',
            {
              'sprite__pokemon--can-click': hasClick
            },
            spriteClasses.name
          )}
          style={backgroundPosition}
          aria-labelledby={`tooltip_${spriteId}`}
          aria-describedby={`describe_${spriteId}`}
        />
      </Tooltip>
    </div>
  );
});

Sprite.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default Sprite;
