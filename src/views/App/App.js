import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import HeaderBar from 'components/HeaderBar/HeaderBar';
import AlertContainer from 'components/AlertContainer';
import Footer from 'components/Footer/Footer';
import TeamPlanner from 'views/TeamPlanner/TeamPlanner';
import TeamViewer from 'views/TeamViewer/TeamViewer';
import Routes from 'constants/routes';
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
    const { match, location } = this.props;
    console.groupCollapsed('App');
    console.log(this.props);
    console.log('pokedex', this.state.pokedex);
    console.log('types', this.state.typeMatchups);
    console.groupEnd();
    return (
      <PokedexContext.Provider value={this.state.pokedex}>
        <TypeContext.Provider value={this.state.typeMatchups}>
          <div className="app app--theme_default">
            <HeaderBar currentPath={location.pathname} />
            <AlertContainer>
              {triggerAlert => (
                <main>
                  <Switch>
                    <Route
                      path={`${match.url}${Routes.savedTeams}`}
                      component={TeamViewer}
                    />
                    <Route
                      path={match.url}
                      render={props => (
                        <TeamPlanner {...props} sendAlert={triggerAlert} />
                      )}
                    />
                  </Switch>
                </main>
              )}
            </AlertContainer>
            <Footer />
          </div>
        </TypeContext.Provider>
      </PokedexContext.Provider>
    );
  }
}

export default App;
