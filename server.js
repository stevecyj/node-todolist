const http = require('http');
const { v4: uuidv4 } = require('uuid');
const headers = require('./headers');
const successHandle = require('./successHandle');
const errorHandle = require('./errorHandle');
const todos = [];
const PORT = process.env.PORT || 8080;

const requestListener = (req, res) => {
  // log method
  console.log(`url:${req.url}, method:${req.method}`);

  // body parser
  let body = '';
  req.on('data', (chunk) => {
    // console.log(chunk);
    body += chunk.toString();
  });

  // body
  // req.on('end', () => {
  //   console.log(body);
  // });

  if (req.url == '/todos' && req.method == 'GET') {
    successHandle(res, todos);
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

          successHandle(res, todos);
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.url == '/todos' && req.method == 'DELETE') {
    todos.length = 0;
    successHandle(res, todos);
  } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex((todo) => todo.id == id);
    // console.log(id, index);
    if (index !== -1) {
      todos.splice(index, 1);
      successHandle(res, todos);
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
          successHandle(res, todos);
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
    errorHandle(res);
  }
};

const server = http.createServer(requestListener);
server.listen(PORT);
