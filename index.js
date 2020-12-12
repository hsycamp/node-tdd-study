const express = require("express");
const app = express();
const port = 3000;
const morgan = require("morgan");
const user = require("./api/user");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", user);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;
