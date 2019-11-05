import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './Table.scss';

function Table({ className, headers, children, hovered, striped, ...props }) {
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

Table.defaultProps = {
  hovered: false,
  striped: false
};

Table.propTypes = {
  headers: PropTypes.element.isRequired,
  children: PropTypes.arrayOf(PropTypes.element),
  hovered: PropTypes.bool,
  striped: PropTypes.bool
};

export default Table;
