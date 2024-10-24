import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { FixedSizeGrid as Grid } from 'react-window';

import chunk from 'ayaka/chunk';
import Sprite from 'components/Sprite';
import { useDimensions } from 'hooks/useDimensions';

const ITEM_SIZE = 45;
const GRID_HEIGHT = 370;
const FALLBACK_WIDTH = 460;

function TeamPlannerGrid({ items, onItemClick }) {
  const [ref, { width = FALLBACK_WIDTH }] = useDimensions();
  const enableSpriteScrollbox = true;

  if (!items.length) {
    return (
      <div
        className={classNames('team-planner__no-results', {
          'team-planner__no-results--scrollbox': enableSpriteScrollbox
        })}
      >
        No pokemon available for the current filters.
      </div>
    );
  }

  const itemsCount = items.length;
  const columnCount = Math.floor(width / ITEM_SIZE);
  const rowCount = Math.ceil(itemsCount / columnCount);
  const matrix = chunk(items, columnCount);

  return (
    <div
      className={classNames('team-planner__sprite-list', {
        'team-planner__sprite-list--scrollbox': enableSpriteScrollbox
      })}
    >
      <div ref={ref}>
        <Grid
          style={{ position: 'static', overflowX: `hidden` }}
          columnCount={columnCount}
          columnWidth={ITEM_SIZE}
          height={GRID_HEIGHT}
          rowCount={rowCount}
          rowHeight={ITEM_SIZE}
          width={width}
        >
          {({ columnIndex, rowIndex, style }) => {
            const item = matrix[rowIndex][columnIndex];

            if (!item) {
              return null;
            }

            return (
              <div key={item.id} style={style}>
                <Sprite data={item} onClick={onItemClick} />
              </div>
            );
          }}
        </Grid>
      </div>
    </div>
  );
}

const SpriteType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  spritePosition: PropTypes.shape({
    backgroundPosition: PropTypes.string
  })
});

TeamPlannerGrid.propTypes = {
  items: PropTypes.arrayOf(SpriteType).isRequired,
  onItemClick: PropTypes.func.isRequired
};

export default TeamPlannerGrid;
