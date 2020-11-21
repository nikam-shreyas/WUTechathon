import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css';


const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  
  fxprovider:'',

  error: null,
};

class Register extends Component {
  constructor(props) {
    super(props);
	
	this.state = { ...INITIAL_STATE };
  }
  
  render() {
	  const {
      username,
      email,
      fxprovider,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;
	
	const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';
	  
    return (
      <form id="Register">
        <h2 style={{fontSize:"40px",alignSelf:"center"}}>Register</h2>
        <div className="form-group ">
                    <label>Full Name</label>
	  <input
          name="username" className="form-control"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Full Name"
        /></div>


      <div className="form-group ">
                    <label>Fx Provider Name</label>                    
        <input
          name="fxprovider" className="form-control"
          value={fxprovider}
          onChange={this.onChange}
          type="text"
          
          placeholder="Fx Provider Name "
        /></div>

        <div className="form-group ">
                    <label>Email address</label>                    
        <input
          name="email" className="form-control"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        /></div>
        <div className="form-group ">
                    <label>Password</label>
        <input
          name="passwordOne" className="form-control"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        /></div>
        <div className="form-group ">
                    <label>Confirm Password</label>
        <input
          name="passwordTwo" className="form-control"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        /></div><br/>
        <button disabled={isInvalid}  className="btn btn-primary btn-block" type="submit">
         Register
        </button><br/>
        {error && <p>{error.message}</p>}
	  
      </form>
    );
  }
}


export default Register;

