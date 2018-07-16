import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { ClearableInput, Tickbox } from 'meiko';
import MultiSelect from 'components/MultiSelect';
import Strings from 'constants/strings';

import './Filters.css';

const FILTERS_INPUT_CLASS = 'filters__input';

const Filters = props => {
  const hideOnCertainScreens = !!props.hiddenOn;
  return (
    <section
      className={classNames('filters', {
        [`filters--hide-on_${props.hiddenOn}`]: hideOnCertainScreens
      })}
    >
      <ClearableInput
        {...props.searchProps}
        className={classNames(FILTERS_INPUT_CLASS)}
      />
      <MultiSelect
        id="generations"
        name="generations"
        placeholder="Select generation(s)"
        label="Generation"
        {...props.generationProps}
        className={classNames(FILTERS_INPUT_CLASS)}
      />
      <MultiSelect
        id="types"
        name="types"
        placeholder="Select type(s)"
        label="Type"
        {...props.typeProps}
        className={classNames(FILTERS_INPUT_CLASS)}
      />
      <MultiSelect
        id="resists"
        name="resists"
        placeholder="Select resistance(s)"
        label="Resists"
        {...props.resistsProps}
        className={classNames(FILTERS_INPUT_CLASS)}
      />
      <MultiSelect
        id="evolutions"
        name="evolutions"
        placeholder="Select evolution form(s)"
        label="Evolution Forms"
        {...props.evolutionsProps}
        className={classNames(FILTERS_INPUT_CLASS)}
      />
      <Tickbox
        name="includeMega"
        text="Include Megas"
        {...props.includeMegaProps}
        className={classNames(FILTERS_INPUT_CLASS)}
      />
      <Tickbox
        name="includeVariants"
        text="Include variants"
        {...props.includeVariantsProps}
        className={classNames(FILTERS_INPUT_CLASS)}
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
  resistsProps: multiselectPropTypes,
  evolutionsProps: multiselectPropTypes,
  hiddenOn: PropTypes.oneOf([Strings.large, Strings.small])
};

export default Filters;
