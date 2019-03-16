import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import App from 'views/App';
import Routes from 'constants/routes';
import registerServiceWorker from './registerServiceWorker';
import preloadImages from './preloadImages';
import Driver from './driver';

// TODO remove this when meiko uses css-in-js!!
import 'meiko/components/bundle.min.css';
import './styles/index.scss';

window.Lusamine = Driver;
preloadImages();

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
