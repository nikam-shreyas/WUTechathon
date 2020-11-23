import React, { Component } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === "" || email === "";
    return (
      <div className="wrapper">
        <div className="con1">
          <div className="l_con">
            <form id="Login" action="http://localhost:5001/login" method="POST">
              <h1>Login</h1>
              <br />
              <div className="form-group ">
                <label style={{ padding: "10px" }}>Email address</label>
                <input
                  name="email"
                  className="form-control"
                  type="email"
                  minlength="4"
                  placeholder="Email Address"
                  required
                />
              </div>
              <br />
              <div className="form-group">
                <label style={{ padding: "10px" }}>Password</label>
                <input
                  name="password"
                  className="form-control"
                  type="password"
                  placeholder="Password"
                  required
                  minlength="6"
                />
              </div>
              <br />
              <button className="btn btn-primary btn-block" type="submit">
                Login
              </button>
              <br />
              {error && <p>{error.message}</p>}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
