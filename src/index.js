import './styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import App from 'components/App';
import Routes from 'constants/routes';

import registerServiceWorker from './registerServiceWorker';
import preloadImages from './preloadImages';
import Driver from './driver';

preloadImages();
window.Lusamine = Driver;

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Redirect exact from="/" to={Routes.base} />
      <Route path={Routes.base} component={App} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
