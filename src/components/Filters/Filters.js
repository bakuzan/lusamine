import PropTypes from 'prop-types';
import React from 'react';

import { ClearableInput } from 'meiko';

const Filters = props => {
  return (
    <section className="filters">
      <ClearableInput {...props.searchProps} />
    </section>
  );
};

Filters.propTypes = {
  searchProps: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func
  }).isRequired
};

export default Filters;
