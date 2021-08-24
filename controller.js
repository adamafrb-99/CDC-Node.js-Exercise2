const fs = require("fs");
const data = require("./db.json");

class Controller {
  // Get all todos
  async getTodos() {
    return new Promise((resolve, _) => resolve(data));
  }

  // Create a todo
  async createTodo(res, todo) {
    const currentDate = new Date();
    return new Promise((resolve, _) => {
      // Validate the length of description
      if (todo.description.length > 100) {
        const message = {
          message: "Length of description must not be greater than 100.",
        };
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify(message, null, 2));
        return;
      }

      // Validate the deadline
      if (new Date(todo.deadline) <= currentDate) {
        const message = {
          message: "Deadline must be in the future, not in the past.",
        };
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify(message, null, 2));
        return;
      }

      let newTodo = {
        id: data.length + 1,
        ...todo,
      };

      data.push(newTodo);

      fs.writeFile("./db.json", JSON.stringify(data), (err) => {
        if (err) {
          const message = {
            message: "Some error occured while creating data.",
          };
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify(message, null, 2));
        }
      });

      resolve(newTodo);
    });
  }

  // Update a todo
  async updateTodo(id, newTodo) {
    return new Promise((resolve, reject) => {
      let todo = data.find((todo) => todo.id === parseInt(id));

      if (!todo) {
        reject(`No todo with id ${id} found`);
      }

      if (newTodo.description) {
        todo.description = newTodo.description;
      }

      if (newTodo.deadline) {
        todo.deadline = newTodo.deadline;
      }

      if (newTodo.done) {
        todo.done = newTodo.done;
      }

      resolve(todo);
    });
  }

  // Delete a todo
  async deleteTodo(res, id) {
    return new Promise((resolve, reject) => {
      let todo = data.find((todo) => todo.id === parseInt(id));

      if (!todo) {
        reject(`No todo with id ${id} found`);
      }

      const newData = data.filter((item) => item.id !== parseInt(id));

      fs.writeFile("./db.json", JSON.stringify(newData), (err) => {
        if (err) {
          const message = {
            message: "Some error occured while deleting data.",
          };
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify(message, null, 2));
        }
      });

      resolve(`Todo deleted successfully`);
    });
  }
}

module.exports = Controller;
