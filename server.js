const http = require('http');

const requestListener = (req, res) => {
  console.log(req.url + '\n', req.method);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('hello');
  res.end();
};

const server = http.createServer(requestListener);
server.listen(8080);
