const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  if (process.env.REACT_APP_USE_PROXY === 'true') {
    app.use(
      createProxyMiddleware('/api', {
        target: process.env.REACT_APP_SERVER,
        changeOrigin: true,
      }),
    )

    app.use(
      createProxyMiddleware('/api', {
        target: process.env.REACT_APP_WS_SERVER,
        ws: true,
        changeOrigin: true,
      }),
    )
  }
}
