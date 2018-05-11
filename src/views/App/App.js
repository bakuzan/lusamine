import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Utils } from 'meiko';

import HeaderBar from 'components/HeaderBar/HeaderBar';
import Footer from 'components/Footer/Footer';
import TeamPlanner from 'views/TeamPlanner/TeamPlanner';
import { PokedexContext } from 'context';
import { getWindowScrollPosition } from 'utils/common';
import getPokedex from 'data';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowScrollPosition: 0,
      pokedex: getPokedex()
    };
  }

  componentDidMount() {
    this.scrollListeners = Utils.Common.createListeners('scroll', () => {
      const windowScrollPosition = getWindowScrollPosition();
      if (windowScrollPosition !== this.state.windowScrollPosition) {
        this.setState({ windowScrollPosition });
      }
    })();
    this.scrollListeners.listen();
  }

  componentWillUnmount() {
    this.scrollListeners.remove();
  }

  render() {
    const isPageScrolled = !!this.state.windowScrollPosition;
    return (
      <PokedexContext.Provider value={this.state.pokedex}>
        <div className="app app--theme_default">
          <HeaderBar title="team planner" isPageScrolled={isPageScrolled} />
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
