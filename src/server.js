import React from 'react';
import streamString from 'node-stream-string';
import { StaticRouter, matchPath } from 'react-router-dom';
import express from 'express';
import { renderToNodeStream } from 'react-dom/server';
import { Provider } from "react-redux";
import serialize from "serialize-javascript";

import App from './app/App';
import routes from './app/routes';
import configureStore from './app/store/configureStore';
import api from './api/fakeapi';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server.use(api);

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res, next) => {

    const store = configureStore();
    
    const promises = routes.reduce((acc, route) => {
      if (matchPath(req.url, route) && route.component && route.component.initialAction) {
        acc.push(Promise.resolve(store.dispatch(route.component.initialAction())));
      }
      return acc;
    }, []);


    Promise.all(promises)
    .then(() => {
      const context = {};
      const markup = renderToNodeStream(
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </Provider>
      );
  
      if (context.url) {
        res.redirect(context.url);
      } else {
        const initialData = store.getState();
        const stream = streamString`
        <!doctype html>
        <html lang="">
          <head>
              <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
              <meta charSet='utf-8' />
              <title>Welcome to Razzle</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
              ${assets.client.css
                ? `<link rel="stylesheet" href="${assets.client.css}">`
                : ''}
              ${process.env.NODE_ENV === 'production'
                ? `<script src="${assets.client.js}" defer></script>`
                : `<script src="${assets.client.js}" defer crossorigin></script>`}
              <script>window.__initialData__ = ${serialize(initialData)}</script>
          </head>
          <body>
              <div id="root">${markup}</div>
          </body>
        </html>`
        stream.pipe(res)
      }

    }).catch(next);
  });

export default server;