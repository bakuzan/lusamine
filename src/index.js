import './styles/index.scss';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import App from 'components/App';
import ScrollToTop from 'components/ScrollToTop';
import RoutePaths from 'constants/routes';

import registerServiceWorker from './registerServiceWorker';
import preloadImages from './preloadImages';
import Driver from './driver';

preloadImages();
window.Lusamine = Driver;

const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route exact path="/" element={<Navigate to={RoutePaths.base} />} />
      <Route path={`${RoutePaths.base}/*`} element={<App />} />
    </Routes>
  </BrowserRouter>
);

registerServiceWorker();
