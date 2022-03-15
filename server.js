const http = require("http");
const { v4: uuidv4 } = require("uuid");
const todos = [];

const requestListener = (req, res) => {
  // log method
  console.log(req.url + "\n", req.method);
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

  // body parser
  let body = "";
  req.on("data", (chunk) => {
    // console.log(chunk);
    body += chunk.toString();
  });

  if (req.url == "/todos" && req.method == "GET") {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    res.end();
  } else if (req.url == "/todos" && req.method == "POST") {
    req.on("end", () => {
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
              status: "success",
              data: todos,
            })
          );
          res.end();
        } else {
          res.writeHead(400, headers);
          res.write(
            JSON.stringify({
              status: "false",
              message: "欄位未填寫正確，或無此 todo id",
            })
          );
          res.end();
        }
      } catch (error) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: "false",
            message: "欄位未填寫正確，或無此 todo id",
          })
        );
        res.end();
      }
    });
  } else if (req.method == "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "no route for this site",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(8080);
