import React, { useState, useMemo } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { Alert, AppInformation, useGlobalStyles } from 'meiko-lib';
import HeaderBar from 'components/HeaderBar';
import AlertContainer from 'components/AlertContainer';
import Footer from 'components/Footer';
import EasterEgg from 'components/EasterEgg';
import TeamPlanner from 'views/TeamPlanner';
import SavedTeamViewer from 'views/TeamViewer/SavedTeams';
import TrainerTeamViewer from 'views/TeamViewer/TrainerTeams';
import Settings from 'views/Settings';
import Pokedex from 'views/Pokedex';

import Routes from 'constants/routes';
import { PokedexContext, TypeContext } from 'context';
import { constructPokedex, getTypeMatchups } from 'data';
import { settingsStore } from 'utils/common';
import logData from './logData';
import getPageTitleForCurrentPath from './getPageTitle';

const BRANCH = process.env.REACT_APP_BRANCH;
const VERSION = process.env.REACT_APP_VERSION;

const systemMessages = [];

function App({ match, location }) {
  useGlobalStyles();

  const [pokedex] = useState(constructPokedex());
  const [typeMatchups] = useState(getTypeMatchups());
  const [userMessages, setUserMessages] = useState(systemMessages);

  const path = location.pathname;
  const { pageTitle, pageHeader, pageDescription } = useMemo(
    () => getPageTitleForCurrentPath(path),
    [path]
  );

  const settings = settingsStore.get();
  const messages = userMessages.filter(
    (x) => !settings.readMessages.includes(x.id)
  );
  const hasMessages = messages.length > 0;

  logData({ pokedex, typeMatchups });

  return (
    <PokedexContext.Provider value={pokedex}>
      <TypeContext.Provider value={typeMatchups}>
        <div className="theme theme--default">
          <HelmetProvider>
            <Helmet>
              <title>{pageTitle}</title>
              <meta name="description" content={pageDescription} />
            </Helmet>
          </HelmetProvider>
          <HeaderBar pageTitle={pageHeader} />
          {hasMessages && (
            <Alert
              messageClassName="lusamine-alert"
              alerts={messages}
              actions={{
                dismissAlertMessage: (messageId) => {
                  setUserMessages([]);
                  const settings = settingsStore.get();
                  settingsStore.set({
                    readMessages: [...settings.readMessages, messageId]
                  });
                }
              }}
            />
          )}
          <EasterEgg />
          <AlertContainer>
            {(triggerAlert) => (
              <main>
                <Switch>
                  <Route
                    path={`${match.url}${Routes.trainerTeams}`}
                    component={TrainerTeamViewer}
                  />
                  <Route
                    path={`${match.url}${Routes.savedTeams}`}
                    component={SavedTeamViewer}
                  />
                  <Route
                    path={`${match.url}${Routes.settings}`}
                    component={Settings}
                  />
                  <Route
                    path={`${match.url}${Routes.pokedex}/:npn?`}
                    component={Pokedex}
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

export default App;
