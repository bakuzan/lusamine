import React from 'react';

import Filters from 'components/Filters/Filters';
import Team from 'components/Team/Team';
import List from 'components/List/List';

class PlannerPage extends React.Component {
  render() {
    return (
      <div id="team-planner">
        <Filters />
        <div>
          <Team />
          <List
            items={[]}
            itemTemplate={(item, i) => {
              return <div key={i}>placeholder</div>;
            }}
          />
        </div>
      </div>
    );
  }
}

export default PlannerPage;
