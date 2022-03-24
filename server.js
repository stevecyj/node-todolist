const http = require('http');
const { v4: uuidv4 } = require('uuid');
const headers = require('./headers');
const errorHandle = require('./errorHandle');
const todos = [];

const requestListener = (req, res) => {
  // log method
  console.log(req.url + '\n', req.method);

  // body parser
  let body = '';
  req.on('data', (chunk) => {
    // console.log(chunk);
    body += chunk.toString();
  });

  if (req.url == '/todos' && req.method == 'GET') {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      })
    );
    res.end();
  } else if (req.url == '/todos' && req.method == 'POST') {
    req.on('end', () => {
      // 異常行為
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          const todo = {
            id: uuidv4(),
            title,
          };
          todos.push(todo);

          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.url == '/todos' && req.method == 'DELETE') {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
        delete: 'yes',
      })
    );
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex((todo) => todo.id == id);
    // console.log(id, index);
    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: 'success',
          data: todos,
          delete: 'yes',
        })
      );
      res.end();
    } else {
      errorHandle(res);
    }
  } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
    req.on('end', () => {
      try {
        const todo = JSON.parse(body).title;
        const id = req.url.split('/').pop();
        console.log(id, todo);
        const index = todos.findIndex((todo) => todo.id == id);
        if (todo !== undefined && index !== -1) {
          todos[index].title = todo;
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.method == 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'false',
        message: 'no route for this site',
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8080);
