import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import HeaderBar from 'components/HeaderBar/HeaderBar';
import Footer from 'components/Footer/Footer';
import TeamPlanner from 'views/TeamPlanner/TeamPlanner';
import { PokedexContext, TypeContext } from 'context';
import { constructPokedex, getTypeMatchups } from 'data';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pokedex: constructPokedex(),
      typeMatchups: getTypeMatchups()
    };
  }

  render() {
    console.groupCollapsed('App');
    console.log('pokedex', this.state.pokedex);
    console.log('types', this.state.typeMatchups);
    console.groupEnd();
    return (
      <PokedexContext.Provider value={this.state.pokedex}>
        <TypeContext.Provider value={this.state.typeMatchups}>
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
        </TypeContext.Provider>
      </PokedexContext.Provider>
    );
  }
}

export default App;
