import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { Provider } from "react-redux";
import { hydrate } from 'react-dom';
import configureStore from "../src/app/store/configureStore";

import App from './app/App';

const store = configureStore(window.__initialData__);

hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
