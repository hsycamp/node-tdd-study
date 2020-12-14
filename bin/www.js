const { request } = require("express");

const app = require("../index");
const port = 3000;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
