var express = require("express"),
  app = express(),
  cors = require("cors"),
  port = process.env.PORT || 5000,
  bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var routes = require("./api/routes/apiRoutes"); //importing route
routes(app); //register the route

app.listen(port);

console.log("RESTful API server started on: " + port);
