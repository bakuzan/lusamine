import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { ClearableInput, Tickbox, MultiSelect, useWindowSize } from 'mko';
import Strings from 'constants/strings';
import { media } from 'utils/media';

import './Filters.scss';

const FILTERS_INPUT_CLASS = 'filters__input';

function Filters(props) {
  const hideOnCertainScreens = !!props.hiddenOn;
  const shouldHide = media.get(props.hiddenOn);
  const size = useWindowSize();

  if (shouldHide(size.width)) {
    return null;
  }

  return (
    <section
      className={classNames('filters', {
        [`filters--hide-on_${props.hiddenOn}`]: hideOnCertainScreens
      })}
    >
      <ClearableInput
        {...props.searchProps}
        id="search"
        label="Search"
        containerClassName={classNames(FILTERS_INPUT_CLASS)}
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
        id="includeMega"
        name="includeMega"
        text="Include Megas"
        {...props.includeMegaProps}
        containerClassName={classNames(FILTERS_INPUT_CLASS)}
      />
      <Tickbox
        id="includeVariants"
        name="includeVariants"
        text="Include variants"
        {...props.includeVariantsProps}
        containerClassName={classNames(FILTERS_INPUT_CLASS)}
      />
    </section>
  );
}

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
