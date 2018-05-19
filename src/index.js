import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import App from 'views/App/App';
import registerServiceWorker from './registerServiceWorker';
import 'meiko/dist/bundle.min.css';
import './styles/index.css';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Redirect exact from="/" to="/lusamine" />
      <Route path="/lusamine" component={App} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
