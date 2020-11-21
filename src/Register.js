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
      <div className="wrapper">
      <div className="con2">
      <form id="Register" method="POST" action="http://localhost:5000/register">
        <h2 style={{fontSize:"40px",alignSelf:"center"}}>Register</h2>
        <div className="form-group ">
                    <label  style={{padding:"10px"}}>Full Name</label>
	  <input
          name="username" className="form-control"
          
          required
          type="text"
          placeholder="Full Name"
        /></div>


      <div className="form-group ">
                    <label  style={{padding:"10px"}}>Fx Provider Name</label>                    
        <input
          name="fxprovider" className="form-control"
          
         required
          type="text"
          
          placeholder="Fx Provider Name "
        /></div>

        <div className="form-group ">
                    <label  style={{padding:"10px"}}>Email address</label>                    
        < input name="email" className="form-control" 
          
          type="email" minlength = "4" pattern = "^[a-zA-Z0-9_.-]*$"
          placeholder="Email Address"  required
          
        /></div>
        <div className="form-group ">
                    <label  style={{padding:"10px"}}>Password</label>
        <input
          name="passwordOne" className="form-control"
          
          required minlength = "6"
          type="password"
          placeholder="Password"
        /></div>
        <div className="form-group ">
                    <label  style={{padding:"10px"}}>Confirm Password</label>
        <input
          name="passwordTwo" className="form-control"
          required minlength = "6"
          type="password"
          placeholder="Confirm Password"
        /></div><br/>
        <button   className="btn btn-primary btn-block" type="submit">
         Register
        </button><br/>
        {error && <p>{error.message}</p>}
	  
      </form>
      </div>
      </div>
    );
  }
}


export default Register;

