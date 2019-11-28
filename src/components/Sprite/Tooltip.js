import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { useState, useRef, useEffect } from 'react';

import Portal from 'meiko/Portal';
import styles from 'meiko/styles/Tooltip';

const PLACE_ABOVE = 'above';
const SCROLLBAR_WIDTH = 20;

function resolvePositioning(tooltip, { at, adjustment }, usePosition, center) {
  const element = tooltip && tooltip.current;

  const rect = element
    ? element.getBoundingClientRect()
    : { height: 0, left: 0, top: 0, width: 0 };

  const startingSpotTop = element ? rect.top + rect.height / 2 : undefined;
  const startingSpotLeft = element ? rect.left + rect.width / 4 : undefined;

  let top = at[1] || startingSpotTop;
  top =
    (usePosition === PLACE_ABOVE ? rect.top - rect.height : top) || undefined;

  let left = at[0] || startingSpotLeft;

  const leftForCenter = adjustment ? left : startingSpotLeft;
  left = (center ? leftForCenter + rect.width / 4 : left) || undefined;

  const transform = adjustment
    ? { transform: `translateX(${adjustment}px)` }
    : {};

  let style = usePosition ? { top, left, bottom: 'unset' } : null;
  style = style ? { ...style, ...transform } : { ...transform };

  return style;
}

function Tooltip({
  className,
  contentId,
  text,
  children,
  allowWrapping,
  usePosition,
  delay,
  center,
  highlight,
  isEnabled,
  attachTo,
  ...props
}) {
  const timer = useRef();
  const tooltip = useRef();
  const [{ hovered, ...other }, setHovered] = useState({
    hovered: false,
    at: [],
    adjustment: null
  });

  // Clear timeout on unmount
  useEffect(() => () => clearTimeout(timer.current), []);

  const style = resolvePositioning(tooltip, other, usePosition, center);

  function handleEnter() {
    if (!isEnabled) {
      return;
    }

    let adjustment = null;

    const rect = tooltip.current.getBoundingClientRect();
    const clientX = rect.x;
    const clientY = rect.y;

    const contentWidth = tooltip.current.firstChild.offsetWidth;
    const halfWidth = contentWidth / 2;
    const positionOffset = usePosition ? clientX : rect.left;
    const space = window.innerWidth - positionOffset - SCROLLBAR_WIDTH;

    const tooFarLeft = (center || usePosition) && positionOffset < halfWidth;
    const tooFarRight = space < (center ? halfWidth : contentWidth);

    if (tooFarLeft) {
      const delta = center ? rect.width / 2 : 0;
      adjustment = -rect.left + 10 - delta;
    } else if (tooFarRight) {
      const widthDelta = center ? contentWidth + rect.width / 2 : contentWidth;
      adjustment = -(widthDelta - space) - SCROLLBAR_WIDTH;
    }

    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setHovered({
        hovered: true,
        at: [clientX, clientY],
        adjustment
      });
    }, delay);
  }

  function handleLeave() {
    if (!isEnabled) {
      return;
    }

    clearTimeout(timer.current);
    setHovered({ hovered: false, at: [] });
  }

  const TooltipContent = ({ hidden, readable }) => (
    <div
      id={(readable && contentId) || undefined}
      style={style}
      aria-hidden={!readable}
      className={classNames(
        'tooltip__content',
        styles.tooltipContent,
        !hidden && [
          hovered && styles.tooltipContent__hovered,
          allowWrapping && styles.tooltipContent__wrap,
          usePosition && styles.tooltipContent__fixed,
          center && styles.tooltipContent__center
        ]
      )}
    >
      {text}
    </div>
  );

  return (
    <div
      ref={tooltip}
      className={classNames('tooltip', styles.tooltip, className, [
        highlight && hovered && styles.tooltip__highlight
      ])}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...props}
    >
      <TooltipContent hidden readable={isEnabled} />
      {isEnabled && hovered && attachTo && (
        <Portal querySelector={attachTo}>
          <TooltipContent readable={false} />
        </Portal>
      )}
      {children}
    </div>
  );
}

Tooltip.displayName = 'Tooltip';
Tooltip.defaultProps = {
  isEnabled: true,
  allowWrapping: false,
  usePosition: false,
  center: false,
  highlight: false,
  delay: 0,
  attachTo: null
};

Tooltip.propTypes = {
  isEnabled: PropTypes.bool,
  text: PropTypes.string.isRequired,
  allowWrapping: PropTypes.bool,
  usePosition: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([PLACE_ABOVE])
  ]),
  delay: PropTypes.number,
  center: PropTypes.bool,
  highlight: PropTypes.bool,
  contentId: PropTypes.string,
  attachTo: PropTypes.string
};

export default Tooltip;
