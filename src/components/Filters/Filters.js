import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { ClearableInput, MultiSelect } from 'meiko';
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
      <MultiSelect
        name="generations"
        id="generations"
        placeholder="Select generation(s)"
        label="Generation"
        {...props.generationProps}
      />
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
