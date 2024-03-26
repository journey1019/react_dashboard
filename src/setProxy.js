import { koIotUrl } from 'config';
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: koIotUrl + '/user/login',
            pathRewrite: {
                '^/api': '',
            },
        }),
    );
};