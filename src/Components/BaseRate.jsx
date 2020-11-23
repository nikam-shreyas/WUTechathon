import React, { Component } from "react";
import { list2 } from "../Helper/List";
class BaseRate extends Component {
  state = {
    base: "USD",
    rates: [{ quote: "_", freeforex: "", exchangerate: "" }],
    isLoaded: false,
  };
  constructor(props) {
    super(props);
    this.setState({ base: props.base });
    this.toggle = this.toggle.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
  }
  toggle() {
    document.getElementsByClassName("ratesTable")[0].style.height = "auto";
  }
  handleSelectionChange(selection) {
    this.setState({ base: selection["e"] });
    // console.log()
    this.fetchData();
  }
  fetchData() {
    fetch("http://localhost:5000/exchrate?base=" + this.state.base, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Qrigin": "*",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let rates = [];
        res["resp"].forEach((element) => {
          let temp = {};
          temp["quote"] = element[0];
          temp["exchangerate"] = element[1][0]["exchangerate"];
          temp["freeforex"] = element[1][1]["freeforex"];
          let tempDate = new Date();
          temp["date"] =
            tempDate.getHours() +
            ":" +
            tempDate.getMinutes() +
            ":" +
            tempDate.getSeconds();
          rates.push(temp);
        });
        this.setState({
          rates: rates,
        });
        this.setState({ isLoaded: true });
      });
  }
  componentDidMount() {
    this.fetchData();
  }
  render() {
    if (this.state.isLoaded) {
      return (
        <div>
          <div
            style={{
              backgroundColor: "#2b3f5e",
              marginLeft: "-4px",
              marginRight: "-4px",
              marginTop: "-10px",
              marginBottom: "10px",
            }}
          >
            <center>
              {" "}
              <button
                className="btn btn-secondary btn-sm dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Select Base: {this.state.base} {"   "}
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                {list2.map((e) => (
                  <a
                    className="dropdown-item"
                    onClick={() => {
                      this.handleSelectionChange({ e });
                    }}
                  >
                    {e}
                  </a>
                ))}
              </div>
            </center>
          </div>
          <div className="ratesTable">
            <table>
              <tr className="ratesHeader">
                <td>Quote</td>
                <td>ExchangeRate</td>
                <td>FreeForex</td>
                <td>TimeStamp</td>
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
              {this.state.rates.map((element, i) => (
                <tr key={i} className="ratesItem">
                  <td className="rateQuote">
                    {this.state.base + element["quote"]}
                  </td>
                  <td>{element["exchangerate"]}</td>
                  <td>{element["freeforex"]}</td>
                  <td className="ratesDate">{element["date"]}</td>
                </tr>
              ))}
            </table>
          </div>

          <button
            className="btn btn-block btn-sm btn-outline-primary mt-2 ratesButton"
            onClick={this.toggle}
          >
            View All
          </button>
        </div>
      );
    } else {
      return <>Fetching Rates...</>;
    }
  }
}

export default BaseRate;
