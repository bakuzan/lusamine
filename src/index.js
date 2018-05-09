import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from 'views/App/App';
import registerServiceWorker from './registerServiceWorker';
import 'meiko/dist/bundle.min.css';
import './styles/index.css';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
