import React from 'react';

import Strings from 'constants/strings';

const List = props => {
  const hasItems = props.items.length > 0;
  return (
    <div>
      <ul className="list">
        {!hasItems && <li key="NONE">{Strings.emptyList}</li>}
        {hasItems && props.items.map(props.itemTemplate)}
      </ul>
    </div>
  );
};

export default List;
