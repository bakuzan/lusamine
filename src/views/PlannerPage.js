import React from 'react';

import Filters from 'components/Filters/Filters';
import Team from 'components/Team/Team';
import List from 'components/List/List';

class PlannerPage extends React.Component {
  render() {
    return (
      <div>
        <Filters />
        <Team />
        <List />
      </div>
    );
  }
}

export default PlannerPage;
