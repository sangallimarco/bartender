const proxy = require('http-proxy-middleware')

module.exports = app => {
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
}