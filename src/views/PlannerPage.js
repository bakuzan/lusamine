import React from 'react';

import Filters from 'components/Filters/Filters';
import Team from 'components/Team/Team';
import List from 'components/List/List';
import Sprite from 'components/Sprite/Sprite';
import { PokedexContext } from 'context';

function iteratePokedexToList(dex) {
  return Array.from(dex).map(([id, item]) => item);
}

class PlannerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };

    this.handleSearchInput = this.handleSearchInput.bind(this);
  }

  handleSearchInput(e) {
    this.setState({ search: e.target.value });
  }

  render() {
    const searchProps = {
      value: this.state.search,
      onChange: this.handleSearchInput
    };

    return (
      <PokedexContext.Consumer>
        {pokedex => (
          <div id="team-planner">
            <Filters searchProps={searchProps} />
            <div>
              <Team />
              <List
                items={iteratePokedexToList(pokedex)}
                itemTemplate={(item, i) => <Sprite key={i} data={item} />}
              />
            </div>
          </div>
        )}
      </PokedexContext.Consumer>
    );
  }
}

export default PlannerPage;
