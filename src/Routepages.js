import App from "./App";
import * as ROUTES from "./Routes";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
const Routepages = () => (
  <Router>
    <div>
      <Route exact path={ROUTES.APP} component={App} />
    </div>
  </Router>
);
export default Routepages;
