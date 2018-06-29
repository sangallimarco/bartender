const express = require('express');
const expressWs = require('express-ws');
const path = require('path');
const os = require('os');

const {
    webSocketRouter,
    webSocketMiddleware
} = require('./services');

const {
    app
} = expressWs(express());

const PORT = 8080;
const ROOT_PATH = __dirname;

// routes
webSocketRouter.on('/make', (ws, uri, data) => {
    console.log('make cocktail', data);
});


// testing post processing
webSocketRouter.on('/test', (ws, uri, data) => {
    console.log('test');
});

app.use('/ws', webSocketMiddleware);
app.use('/app', express.static(path.join(ROOT_PATH, 'client/build')));
app.use('/assets', express.static(path.join(ROOT_PATH, 'assets')));

console.log(`Open browser page: http://localhost:${PORT}/app`);
app.listen(PORT);