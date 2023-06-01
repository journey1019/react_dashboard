const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://iotgwy.commtrace.com/restApi/user/login',
            pathRewrite: {
                '^/api': '',
            },
        }),
    );
};