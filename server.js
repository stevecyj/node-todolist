const http = require('http');

const requestListener = (req, res) => {
  console.log(req.url + '\n', req.method);
  const headers = { 'Content-Type': 'text/plain' };

  if (req.url == '/' && req.method == 'GET') {
    res.writeHead(200, headers);
    res.write('index');
    res.end();
  } else if (req.url == '/' && req.method == 'DELETE') {
    res.writeHead(200, headers);
    res.write('delete');
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write('not found 404');
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(8080);
