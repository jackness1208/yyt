const http = require('http');
const cache = {
  server: null
};
const PXY_PORT = 8887;

cache.server = http.createServer();
cache.server.on('request', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.write('It is proxy page');
  res.end();
});
cache.server.listen(PXY_PORT);
