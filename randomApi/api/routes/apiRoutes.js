"use strict";
module.exports = function (app) {
  var apiList = require("../controllers/apiController");

  // todoList Routes
  app.route("/getAll").get(apiList.fetchAll);

  app.route("/getPair/:pair").get(apiList.fetchPair);
};
