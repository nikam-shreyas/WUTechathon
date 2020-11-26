import "./App.css";
import React, { Component } from "react";
import Selector from "./Components/Selector";
import { FcLineChart } from "react-icons/fc";
import HistoricalGraph from "./Components/HistoricalGraph";
import LiveRates from "./Components/LiveRates";
import News from "./Components/News";
import LiveGraph from "./Components/LiveGraph";
import BaseRate from "./Components/BaseRate";
import Convertor from "./Components/Convertor";
import { list2 } from "./Helper/List";
class App extends Component {
  state = {
    selection: "USDINR",
    base: "USD",
    quote: "INR",
    history1: 0,
    history2: 0,
    history3: 0,
    refreshRate: 3000,
  };

  constructor(props) {
    super(props);
    this.setSelection = this.setSelection.bind(this);
  }
  fetchRates() {
    setInterval(() => {
      let urlLink =
        "http://localhost:5000/getProviders?base=" +
        this.state.base +
        "&quote=" +
        this.state.quote;
      fetch(urlLink, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Qrigin": "*",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (this.state.history1 > res["exchangerate"]) {
            this.setState({ updateRate1: "danger" });
          } else {
            this.setState({ updateRate1: "success" });
          }
          if (this.state.history2 > res["freeforex"]) {
            this.setState({ updateRate2: "danger" });
          } else {
            this.setState({ updateRate2: "success" });
          }
          if (this.state.history3 > res["fixer"]) {
            this.setState({ updateRate3: "danger" });
          } else {
            this.setState({ updateRate3: "success" });
          }
          this.setState({ history1: res["exchangerate"] });
          this.setState({ history2: res["freeforex"] });
          this.setState({ history3: res["fixer"] });
        });
    }, 5000);
  }
  setSelection() {
    this.setState({ selection: document.getElementById("selector").value });
  }
  handleBaseChange(e) {
    this.setState({ base: e["e"] });
  }
  handleQuoteChange(e) {
    this.setState({ quote: e["e"] });
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
          <div className="col-sm-4 selector">
            <LiveRates />
          </div>
          <div className="col-sm-4 selector">
            <div
              className="historical-header"
              style={{ marginLeft: "-5px", marginRight: "-5px" }}
            >
              Select Base and Quote
            </div>
            <div className="row mt-2">
              <div className="col-sm-6">
                Base:
                <button
                  className="btn btn-primary btn-block btn-sm dropdown-toggle mt-1"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {this.state.base}
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  {list2.map((e) => (
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        this.handleBaseChange({ e });
                      }}
                    >
                      {e}
                    </a>
                  ))}
                </div>
              </div>
              <div className="col-sm-6">
                Quote:
                <button
                  className="btn btn-primary btn-block btn-sm dropdown-toggle mt-1"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {this.state.quote}
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  {list2.map((e) => (
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        this.handleQuoteChange({ e });
                      }}
                    >
                      {e}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-4 selector">
            <News />
          </div>
        </div>
        <div className="row ">
          <div className="col-sm-3 selector">
            <BaseRate base={this.state.base} />
          </div>
          <div className="col-sm-4 selector">
            <div
              className="historical-header"
              style={{
                marginRight: "-5px",
                marginLeft: "-5px",
                marginTop: "3px",
                height: "30px",
              }}
            >
              Live Rates
            </div>

            <LiveGraph
              base={this.state.base}
              quote={this.state.quote}
              selection={this.state.selection}
              data={this.state.history}
            />
          </div>
          <div className="col-sm-5 selector">
            <HistoricalGraph selection={this.state.selection} />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4 selector">
            <div
              className="historical-header"
              style={{ marginLeft: "-5px", marginRight: "-5px" }}
            >
              <small>Providers</small>
              <small style={{ float: "right" }}>
                {this.state.base}/{this.state.quote}
              </small>
            </div>
            <p
              id="ratesDisplay"
              style={{ marginTop: "5px", marginBottom: "5px" }}
            >
              <small className="text-sm text-muted">ExchangeRatesApi </small>
              <small
                style={{ float: "right" }}
                className={"text-right text-sm text-" + this.state.updateRate1}
              >
                {this.state.history1}
              </small>
              <br />
              <small className="text-sm text-muted">FreeForexApi </small>
              <small
                style={{ float: "right" }}
                className={"text-right text-sm text-" + this.state.updateRate2}
              >
                {this.state.history2}
              </small>
              <br />
              <small className="text-sm text-muted">Fixer.io </small>
              <small
                style={{ float: "right" }}
                className={"text-sm text-" + this.state.updateRate3}
              >
                {this.state.history3}
              </small>
            </p>
          </div>
          <div className="col-sm-4 selector">
            <Convertor />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
