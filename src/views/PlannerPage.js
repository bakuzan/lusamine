import React from 'react';

import Filters from 'components/Filters/Filters';
import Team from 'components/Team/Team';
import List from 'components/List/List';
import Sprite from 'components/Sprite/Sprite';

class PlannerPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearchInput = this.handleSearchInput.bind(this);
  }

  handleSearchInput(e) {
    this.setState({ search: e.target.value });
  }

  render() {
    const searchProps = {
      value: '',
      onChange: this.handleSearchInput
    };

    return (
      <div id="team-planner">
        <Filters searchProps={searchProps} />
        <div>
          <Team />
          <List
            items={[]}
            itemTemplate={(item, i) => <Sprite key={i} data={item} />}
          />
        </div>
      </div>
    );
  }
}

export default PlannerPage;
