import Landing from './Landing';
import Register from './Register';
import Login from './Login';
import App from './App';
import * as ROUTES from './Routes';
import {
    BrowserRouter as Router,
    Route,
  } from 'react-router-dom';
const Routepages = () => (
    <Router>
      <div>
        <Route exact path={ROUTES.LANDING} component={Landing} />
        <Route path={ROUTES.REGISTER} component={Register} />
        <Route path={ROUTES.LOGIN} component={Login} />
        <Route path={ROUTES.APP} component={App} />
      </div>
    </Router>
  );
  export default Routepages;