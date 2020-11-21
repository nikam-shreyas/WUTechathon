import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';


const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
 
  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';
    return (
        <div className="wrapper">
      <div className="con">
      <form onSubmit={this.onSubmit} id="Login" >
        <h1>Login</h1>
        <br />
         <div className="form-group ">
                    <label>Email address</label>
        <input
          name="email" className="form-control"  value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        /></div><br/>
         <div className="form-group">
                    <label>Password</label>
        <input
          name="password" className="form-control"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        /></div><br/>
        <button disabled={isInvalid}  className="btn btn-primary btn-block" type="submit">
          Login
        </button>
        <br/> 
        {error && <p>{error.message}</p>}
      </form>
      </div>
      </div>
    );
  }
}


export default Login;
