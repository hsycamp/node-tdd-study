const express = require("express");
const app = express();
const port = 3000;
const morgan = require("morgan");
const users = [
  { id: 1, name: "alice" },
  { id: 2, name: "bek" },
  { id: 3, name: "chris" },
];

app.use(morgan("dev"));

app.get("/users", (req, res) => {
  res.json(users);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;
