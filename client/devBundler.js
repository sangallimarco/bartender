const proxy = require('http-proxy-middleware')
const Bundler = require('parcel-bundler')
const express = require('express')

const bundler = new Bundler('index.html', {
    cache: false
})

const app = express()
app.use(
    proxy('/ws', {
        target: 'ws://localhost:8888',
        ws: true
    })
);
app.use(
    proxy("/assets", {
        "target": "http://localhost:8888",
        "ws": false
    })
);
app.use(bundler.middleware())
app.listen(Number(process.env.PORT || 1234))