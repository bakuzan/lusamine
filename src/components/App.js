import React, { useState, useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Alert from 'meiko/Alert';
import AppInformation from 'meiko/AppInformation';
import Toaster from 'meiko/Toaster';
import { useGlobalStyles } from 'meiko/hooks/useGlobalStyles';

import { ButtonisedNavLink } from 'components/Buttons';
import AppHelmet from 'components/Helmet';
import HeaderBar from 'components/HeaderBar';
import AlertContainer from 'components/AlertContainer';
import Footer from 'components/Footer';
import EasterEgg from 'components/EasterEgg';
import TeamPlanner from 'views/TeamPlanner';
import TeamViewer from 'views/TeamViewer';
import Settings from 'views/Settings';
import Pokedex from 'views/Pokedex';
import TeamStatistics from 'views/TeamStatistics';

import RoutePaths from 'constants/routes';
import { PokedexContext, TypeContext } from 'context';
import { constructPokedex, getTypeMatchups } from 'data';
import { settingsStore } from 'utils/common';
import logData from 'utils/logData';
import getPageTitleForCurrentPath from 'utils/getPageTitle';

/* eslint-disable no-undef */
const BRANCH = process.env.REACT_APP_BRANCH;
const VERSION = process.env.REACT_APP_VERSION;
/* eslint-enable no-undef */

const homePageUrl = RoutePaths.base;
const systemMessages = [];

function App() {
  useGlobalStyles();

  const location = useLocation();
  const [{ pokedex, regions }] = useState(constructPokedex());
  const [typeMatchups] = useState(getTypeMatchups());
  const [userMessages, setUserMessages] = useState(systemMessages);

  const { pathname, search } = location;
  const { pageTitle, pageHeader, pageDescription } = useMemo(
    () => getPageTitleForCurrentPath(pathname, search),
    [pathname, search]
  );

  const settings = settingsStore.get();
  const messages = userMessages.filter(
    (x) => !settings.readMessages.includes(x.id)
  );
  const hasMessages = messages.length > 0;

  logData({ pokedex, regions, typeMatchups });

  return (
    <PokedexContext.Provider value={{ pokedex, regions }}>
      <TypeContext.Provider value={typeMatchups}>
        <div className="theme theme--default">
          <AppHelmet title={pageTitle} description={pageDescription} />

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
                <Routes>
                  <Route
                    path={`${RoutePaths.teams}`}
                    element={<TeamViewer />}
                  />

                  <Route
                    path={`${RoutePaths.teamStatistics}`}
                    element={<TeamStatistics />}
                  />

                  <Route
                    path={`${RoutePaths.settings}`}
                    element={<Settings />}
                  />

                  <Route path={RoutePaths.pokedex}>
                    <Route index element={<Pokedex />} />
                    <Route path={`:id`} element={<Pokedex />} />
                  </Route>

                  <Route path="/">
                    <Route
                      index
                      element={<TeamPlanner sendAlert={triggerAlert} />}
                    />
                    <Route
                      path={`:pokedexKey`}
                      element={<TeamPlanner sendAlert={triggerAlert} />}
                    />
                  </Route>

                  <Route
                    path="*"
                    element={
                      <div>
                        <AppHelmet
                          title="Page not found"
                          description="Unknown route"
                        />
                        <p>Page not found</p>
                        <p>You appear lost...</p>
                        <ButtonisedNavLink to={homePageUrl} link>
                          Return to the homepage
                        </ButtonisedNavLink>
                      </div>
                    }
                  />
                </Routes>
                <Toaster />
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
