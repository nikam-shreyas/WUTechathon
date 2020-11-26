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
    document.getElementsByClassName("ratesTable")[0].style.height =
      document.getElementsByClassName("ratesTable")[0].style.height === "auto"
        ? "230px"
        : "auto";
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
          if (!isNaN(element[1][0]["exchangerate"]))
            temp["exchangerate"] = element[1][0]["exchangerate"].toFixed(5);
          else temp["exchangerate"] = "-";
          if (!isNaN(element[1][1]["freeforex"]))
            temp["freeforex"] = element[1][1]["freeforex"];
          else temp["freeforex"] = "-";
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
  componentWillReceiveProps(props) {
    this.setState({ base: props.base });
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
              marginBottom: "10px",
              marginTop: "5px",
              padding: "7px",
            }}
          >
            <small>Exchange Rates </small>
            <small style={{ float: "right" }}>{this.state.base}</small>
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
              {this.state.rates.reverse().map((element, i) => (
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
