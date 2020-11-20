"use strict";
module.exports = function (app) {
  var apiList = require("../controllers/apiController");

  // todoList Routes
  app.route("/getAll").get(apiList.fetchAll);

  app.route("/getTop").get(apiList.fetchTopFour);

  app.route("/getPair/:pair").get(apiList.fetchPair);

  app.route("/getHistory/:data").get(apiList.fetchHistory);
};
