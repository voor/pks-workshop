const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routes.js");
const app = express();
const port = process.env.NODE_PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

const server = app.listen(port, () => {
  console.log("API running on port.", server.address().port);
});
