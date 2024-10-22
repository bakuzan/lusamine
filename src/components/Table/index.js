import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './Table.scss';

function Table({
  className,
  headers,
  children,
  hovered = false,
  striped = false,
  ...props
}) {
  return (
    <table
      className={classNames(
        'table',
        { 'table--hovered': hovered, 'table--striped': striped },
        className
      )}
      {...props}
    >
      <thead>{headers}</thead>
      <tbody>{children}</tbody>
    </table>
  );
}

Table.propTypes = {
  headers: PropTypes.element.isRequired,
  className: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element),
  hovered: PropTypes.bool,
  striped: PropTypes.bool
};

export default Table;
