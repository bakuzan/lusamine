import classNames from 'classnames';
import React from 'react';

import { MultiSelect as MMultiSelect } from 'meiko';

const MultiSelect = ({ listClassName, ...props }) => (
  <MMultiSelect
    listClassName={classNames('lusamine-multiselect-list', listClassName)}
    {...props}
  />
);

export default MultiSelect;
