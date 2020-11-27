
  import React, { Component } from "react";
  import { FaDownload } from "react-icons/fa";
  import { list } from "../Helper/List";
  
 
  
  class Displayrates extends Component {
    constructor() {
      super();
     
    }
    
 
    
    
    render() {
      
  
      return (
         
<div className="histratesTable">
    < br/>
<center>
<table>
  <tr className="histratesHeader">
    <td>  Fx Provider name</td>
    <td>MAX</td>
    <td>AVG</td>
    <td>MIN</td>
  </tr>
  <tr>
    <td>
      <br />
    </td>
    <td>
      <br />
    </td>
    <td>
      <br />
    </td>
    <td>
      <br />
    </td>
  </tr>
 
</table>
</center>
</div>
            
      );
    }
  }
  
  export default Displayrates;
