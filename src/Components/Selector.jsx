import React, { Component } from "react";
import list from "../Helper/List";
class Selector extends Component {
  state = {};
  render() {
    return (
      <div>
        <div className="cont m-2">
          <div className="dropdown dropdown-dark">
            <select name="selector" id="selector" className="dropdown-select">
              {list.map((e, i) => (
                <option key={i} name="selection" value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default Selector;
