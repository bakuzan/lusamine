import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import ClearableInput from 'meiko/ClearableInput';
import MultiSelect from 'meiko/MultiSelect';
import SelectBox from 'meiko/SelectBox';
import Tickbox from 'meiko/Tickbox';
import { useWindowSize } from 'meiko/hooks/useWindowSize';

import Strings from 'constants/strings';
import { pokedexOptions } from 'constants/pokedex';
import { media } from 'utils/media';

import './Filters.scss';

const FILTERS_INPUT_CLASS = 'filters__input';

function Filters(props) {
  const hideOnCertainScreens = !!props.hiddenOn;
  const hiddenOn =
    props.hiddenOn instanceof Array ? props.hiddenOn : [props.hiddenOn];

  const shouldHide = hiddenOn.map((x) => media.get(x));
  const size = useWindowSize();

  if (shouldHide.some((fn) => fn(size.width))) {
    return null;
  }

  return (
    <section
      className={classNames(
        'filters',
        hideOnCertainScreens && hiddenOn.map((x) => `filters--hide-on_${x}`)
      )}
    >
      <SelectBox
        id="active-pokedex"
        text="Active Pokedex"
        {...props.pokedexProps}
        options={pokedexOptions}
        containerClassName={classNames(FILTERS_INPUT_CLASS)}
      />
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
      <Tickbox
        id="startersOnly"
        name="startersOnly"
        text="Starters only"
        {...props.startersOnlyProps}
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

const checkboxPropTypes = PropTypes.shape({
  checked: PropTypes.bool,
  onChange: PropTypes.func
}).isRequired;

const hiddenOnType = PropTypes.oneOf([
  Strings.large,
  Strings.small,
  Strings.xsmall
]);

Filters.propTypes = {
  searchProps: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func
  }).isRequired,
  generationProps: multiselectPropTypes,
  typeProps: multiselectPropTypes,
  resistsProps: multiselectPropTypes,
  evolutionsProps: multiselectPropTypes,
  includeMegaProps: checkboxPropTypes,
  includeVariantsProps: checkboxPropTypes,
  startersOnlyProps: checkboxPropTypes,
  pokedexProps: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func
  }),
  hiddenOn: PropTypes.oneOfType([hiddenOnType, PropTypes.arrayOf(hiddenOnType)])
};

export default Filters;
