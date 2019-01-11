import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import HeaderBar from 'components/HeaderBar/HeaderBar';
import AlertContainer from 'components/AlertContainer';
import Footer from 'components/Footer/Footer';
import TeamPlanner from 'views/TeamPlanner/TeamPlanner';
import TeamViewer from 'views/TeamViewer/TeamViewer';
import Settings from 'views/Settings';
import { AppInformation } from 'meiko-lib';
import Strings from 'constants/strings';
import Routes from 'constants/routes';
import { PokedexContext, TypeContext } from 'context';
import { constructPokedex, getTypeMatchups } from 'data';
import { capitaliseEachWord } from 'utils/common';

const BRANCH = process.env.REACT_APP_BRANCH;
const VERSION = process.env.REACT_APP_VERSION;

const SAVED_TEAMS = 'saved-teams';
const SETTINGS = 'settings';

const getPageTitleForCurrentPath = (path) => {
  const key = path.includes(SAVED_TEAMS)
    ? 'savedTeams'
    : path.includes(SETTINGS)
      ? 'settings'
      : 'planner';

  const pageHeader = Strings.pageTitle[key];
  return {
    pageTitle: `Lusamine - ${capitaliseEachWord(pageHeader)}`,
    pageHeader,
    pageDescription: Strings.pageDescription[key]
  };
};

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
    const {
      pageTitle,
      pageHeader,
      pageDescription
    } = getPageTitleForCurrentPath(location.pathname);
    console.groupCollapsed('App');
    console.log(this.props);
    console.log('pokedex', this.state.pokedex);
    console.log('types', this.state.typeMatchups);
    console.groupEnd();

    return (
      <PokedexContext.Provider value={this.state.pokedex}>
        <TypeContext.Provider value={this.state.typeMatchups}>
          <div className="app app--theme_default">
            <Helmet>
              <title>{pageTitle}</title>
              <meta name="description" content={pageDescription} />
            </Helmet>
            <HeaderBar pageTitle={pageHeader} />
            <AlertContainer>
              {(triggerAlert) => (
                <main>
                  <Switch>
                    <Route
                      path={`${match.url}${Routes.savedTeams}`}
                      component={TeamViewer}
                    />
                    <Route
                      path={`${match.url}${Routes.settings}`}
                      component={Settings}
                    />
                    <Route
                      path={match.url}
                      render={(props) => (
                        <TeamPlanner {...props} sendAlert={triggerAlert} />
                      )}
                    />
                  </Switch>
                </main>
              )}
            </AlertContainer>
            <Footer />
            <AppInformation branch={BRANCH} version={VERSION} />
          </div>
        </TypeContext.Provider>
      </PokedexContext.Provider>
    );
  }
}

export default App;
