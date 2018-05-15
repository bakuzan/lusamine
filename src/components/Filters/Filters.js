import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { ClearableInput } from 'meiko';
import Strings from 'constants/strings';

import './Filters.css';

const Filters = props => {
  const hideOnCertainScreens = !!props.hiddenOn;
  return (
    <section
      className={classNames('filters', {
        [`filters--hide-on_${props.hiddenOn}`]: hideOnCertainScreens
      })}
    >
      <ClearableInput {...props.searchProps} />
    </section>
  );
};

Filters.propTypes = {
  searchProps: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func
  }).isRequired,
  hiddenOn: PropTypes.oneOf([Strings.large, Strings.small])
};

export default Filters;
