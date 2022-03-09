const http = require("http");
const { v4: uuidv4 } = require("uuid");
const todos = [];

const requestListener = (req, res) => {
  console.log(req.url + "\n", req.method);
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

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
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        data: "post success",
      })
    );
    res.end();
  } else if (req.method == "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        messate: "no route for this site",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(8080);
