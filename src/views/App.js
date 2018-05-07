import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Header } from 'meiko';

import Footer from 'components/Footer/Footer';
import PlannerPage from './PlannerPage';

class App extends Component {
  render() {
    return (
      <div>
        <Header leftAlignTitle title="Pokémon team planner" />
        <main>
          <Switch>
            <Route path="/saved-teams" />
            <Route path="/" component={PlannerPage} />
          </Switch>
        </main>
        <Footer />
      </div>
    );
  }
}

export default App;
