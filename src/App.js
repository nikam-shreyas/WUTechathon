import "./App.css";
import React, { Component } from "react";
import Selector from "./Components/Selector";
import { FcLineChart } from "react-icons/fc";
import HistoricalGraph from "./Components/HistoricalGraph";
import LiveRates from "./Components/LiveRates";
import Convertor from "./Convertor";
import Temp from "./Temp";
import LiveGraph from "./Components/LiveGraph";
class App extends Component {
  state = {
    selection: "USDINR",
    history: "",

    updateRate: "danger",
  };

  constructor(props) {
    super(props);
    this.changeText = this.changeText.bind(this);
    this.setSelection = this.setSelection.bind(this);
  }
  changeText() {
    this.setState({ text: Math.random() });
  }
  fetchRates() {
    setInterval(() => {
      let urlLink = "http://localhost:3001/getPair/" + this.state.selection;
      fetch(urlLink)
        .then((res) => res.json())
        .then((res) => {
          if (this.state.history > res[this.state.selection]) {
            this.setState({ updateRate: "danger" });
          } else {
            this.setState({ updateRate: "success" });
          }
          this.setState({ history: res[this.state.selection] });
        });
    }, 5000);
  }
  setSelection() {
    this.setState({ selection: document.getElementById("selector").value });
  }
  componentDidMount() {
    this.fetchRates();
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-sm-12"
            style={{
              backgroundColor: "#293755af",
            }}
          >
            <p className="header">
              <FcLineChart /> FXSimplified
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-8 selector">
            <LiveRates />
          </div>

          <div className="col-sm-4 selector">
            <p
              id="ratesDisplay"
              style={{ marginTop: "5px", marginBottom: "5px" }}
            >
              <small className="text-sm text-muted">RandomApi </small>
              <small
                style={{ float: "right" }}
                className={"text-right text-sm text-" + this.state.updateRate}
              >
                {this.state.history}
              </small>
              <br />
              <small className="text-sm text-muted">LProvider </small>
              <small
                style={{ float: "right" }}
                className={"text-right text-sm text-" + this.state.updateRate}
              >
                {this.state.history}
              </small>
              <br />
              <small className="text-sm text-muted">ExchangeRatesApi </small>
              <small
                style={{ float: "right" }}
                className={"text-sm text-" + this.state.updateRate}
              >
                {this.state.history}
              </small>
            </p>
          </div>
        </div>
        <div className="row ">
          <div className="col-sm-8 selector">
            <HistoricalGraph selection={this.state.selection} />
          </div>
          <div className="col-sm-4 selector">
            <center>
              <Selector />
              <button
                className="btn mb-2"
                style={{
                  backgroundColor: "#121825",
                  color: "aliceblue",
                }}
                onClick={this.setSelection}
              >
                Select
              </button>
              <br />
              <h2 style={{ marginBottom: "2px" }}>
                {this.state.selection.slice(0, 3) +
                  "/" +
                  this.state.selection.slice(3, 6)}
              </h2>
            </center>
            <LiveGraph
              selection={this.state.selection}
              data={this.state.history}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 selector">
            <div
              className="row"
              id="liveRates"
              style={{ borderLeft: "2px solid cyan", margin: "5px" }}
            >
              <div className="col-sm-12"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;