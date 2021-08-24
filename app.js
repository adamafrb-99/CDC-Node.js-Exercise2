const http = require("http");
const Todo = require("./controller");
const { getReqData } = require("./utils");
const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // GET method
  if (req.url === "/api/todos" && req.method === "GET") {
    const todos = await new Todo().getTodos();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todos));
  }

  // POST method
  else if (req.url === "/api/todos" && req.method === "POST") {
    let todo_data = await getReqData(req);
    let todo = await new Todo().createTodo(res, JSON.parse(todo_data));

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todo));
  }

  // UPDATE method
  else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === "PATCH") {
    try {
      const id = req.url.split("/")[3];

      let todo_data = await getReqData(req);

      let updated_todo = await new Todo().updateTodo(id, JSON.parse(todo_data));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(updated_todo));
    } catch (error) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error }));
    }
  }

  // DELETE method
  else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === "DELETE") {
    try {
      const id = req.url.split("/")[3];
      let message = await new Todo().deleteTodo(res, id);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message }));
    } catch (error) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error }));
    }
  }

  // Invalid routes
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
