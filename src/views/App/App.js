import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import HeaderBar from 'components/HeaderBar/HeaderBar';
import Footer from 'components/Footer/Footer';
import TeamPlanner from 'views/TeamPlanner/TeamPlanner';
import { PokedexContext } from 'context';
import getPokedex from 'data';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pokedex: getPokedex()
    };
  }

  render() {
    return (
      <PokedexContext.Provider value={this.state.pokedex}>
        <div className="app app--theme_default">
          <HeaderBar title="team planner" />
          <main>
            <Switch>
              <Route path="/saved-teams" />
              <Route path="/" component={TeamPlanner} />
            </Switch>
          </main>
          <Footer />
        </div>
      </PokedexContext.Provider>
    );
  }
}

export default App;
