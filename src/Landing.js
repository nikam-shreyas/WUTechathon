import React, {Component} from 'react';
import './Landing.css';
import { FcLineChart } from "react-icons/fc";
import { Link , withRouter } from 'react-router-dom';
import * as ROUTES from './Routes';

class Landing extends Component{
    render(){
        return(
            <div className="main">
                 <div className="wrapper">
            <div className="con">
        <h1 id="hd"><FcLineChart />
      FXSimplified</h1>
      <div className="Button1">
      <Link to={ROUTES.LOGIN}><button className="btn btn-primary btn-mb2" id="log" style={{color: "aliceblue",
    width:"180px",
    height:"50px",
    }} >
        
   User login
  </button></Link>
</div>
<br />
<div className="Button2">
  <Link to={ROUTES.REGISTER}><button  id="reg" className="btn btn-primary btn-block" style={{color: "aliceblue",
    width:"180px",
    height:"50px",
   }} >
   User Registration
  </button></Link>
  </div>
    </div>
  </div>
                
                
            </div>
        )
    }
}

export default Landing;
