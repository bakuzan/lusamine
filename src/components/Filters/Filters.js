import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { ClearableInput } from 'meiko';
import MultiSelect from 'components/MultiSelect';
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
        id="generations"
        name="generations"
        placeholder="Select generation(s)"
        label="Generation"
        {...props.generationProps}
      />
      <MultiSelect
        id="types"
        name="types"
        placeholder="Select type(s)"
        label="Type"
        {...props.typeProps}
      />
      <MultiSelect
        id="resists"
        name="resists"
        placeholder="Select resistance(s)"
        label="Resists"
        {...props.typeProps}
      />
    </section>
  );
};

const multiselectPropTypes = PropTypes.shape({
  values: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  options: PropTypes.arrayOf(PropTypes.object),
  onUpdate: PropTypes.func
}).isRequired;

Filters.propTypes = {
  searchProps: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func
  }).isRequired,
  generationProps: multiselectPropTypes,
  typeProps: multiselectPropTypes,
  hiddenOn: PropTypes.oneOf([Strings.large, Strings.small])
};

export default Filters;
