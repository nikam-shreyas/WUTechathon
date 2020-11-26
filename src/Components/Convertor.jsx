import React, { Component } from "react";
import { list2 } from "../Helper/List";
class Convertor extends Component {
  state = {
    base: "USD",
    quote: "INR",
    amount: 1,
    convert: 1,
    reverse: 1,
    timestamp: "",
  };
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.handleBaseChange = this.handleBaseChange.bind(this);
    this.handleQuoteChange = this.handleQuoteChange.bind(this);
    this.handleConvertChange = this.handleConvertChange.bind(this);
    this.handleReverseChange = this.handleReverseChange.bind(this);
    this.handleInterchange = this.handleInterchange.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ base: nextProps.base, quote: nextProps.quote });
    this.fetchData();
  }
  fetchData() {
    let tempRate = "",
      tempRev = "";
    fetch(
      "https://api.exchangeratesapi.io/latest?symbols=" +
        this.state.quote +
        "&base=" +
        this.state.base
    )
      .then((res) => res.json())
      .then((res) => {
        tempRate = Number(res["rates"][this.state.quote]).toFixed(5);
        tempRev = Number(1 / tempRate).toFixed(5);
      })
      .then(() => {
        this.setState({
          convert: tempRate,
          reverse: tempRev,
          timestamp: new Date().toLocaleString(),
        });
        document.getElementById("convertFrom").value = 1;
        document.getElementById("convertTo").value = this.state.convert;
      });
  }
  handleBaseChange(e) {
    this.setState({ base: e["e"] });
    this.fetchData();
  }
  handleQuoteChange(e) {
    this.setState({ quote: e["e"] });
    this.fetchData();
  }
  handleConvertChange(e) {
    this.setState({ amount: e.target.value });
    document.getElementById("convertTo").value = Number(
      e.target.value * this.state.convert
    ).toFixed(5);
  }
  handleReverseChange(e) {
    document.getElementById("convertFrom").value = Number(
      e.target.value * this.state.reverse
    ).toFixed(5);
  }
  handleInterchange() {
    let temp = this.state.base;
    this.setState({ base: this.state.quote, quote: temp });
    temp = this.state.convert;
    this.setState({ convert: this.state.reverse, reverse: temp });
    temp = document.getElementById("convertFrom").value;
    document.getElementById("convertFrom").value = document.getElementById(
      "convertTo"
    ).value;
    document.getElementById("convertTo").value = temp;
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-5">
            Base: {"   "}
            <button
              className="btn btn-secondary btn-sm dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {this.state.base}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {list2.map((e, i) => (
                <a
                  className="dropdown-item"
                  key={i}
                  onClick={() => {
                    this.handleBaseChange({ e });
                  }}
                >
                  {e}
                </a>
              ))}
            </div>
            <input
              className="form-control"
              type="number"
              name="convertFrom"
              id="convertFrom"
              onChange={this.handleConvertChange}
            />
          </div>
          <div className="col-sm-2">
            <button
              className="btn btn-sm btn-primary mt-3"
              onClick={this.handleInterchange}
            >
              &lt;&gt;
            </button>
          </div>
          <div className="col-sm-5">
            Quote: {"   "}
            <button
              className="btn btn-secondary btn-sm dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {this.state.quote}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
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
            <input
              className="form-control"
              type="number"
              name="convertTo"
              id="convertTo"
              onChange={this.handleReverseChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 mt-3 mb-2 ml-1">
            <small style={{ fontSize: "15px" }} className="text-muted text-sm">
              <small style={{ color: "white" }}>{this.state.base}</small> &gt;{" "}
              <small style={{ color: "white" }}>{this.state.quote}</small> Rate
              is: <small style={{ color: "white" }}>{this.state.convert}</small>{" "}
              <br />
              <small style={{ color: "white" }}>
                {this.state.quote}
              </small> &gt;{" "}
              <small style={{ color: "white" }}>{this.state.base}</small> Rate
              is: <small style={{ color: "white" }}>{this.state.reverse}</small>
              <br />
              <p className="mt-2" style={{ color: "white", fontSize: "12px" }}>
                {this.state.base}/{this.state.quote} for the 24-hour period
                fetched at{" "}
                <b style={{ fontWeight: "bold", color: "#49aff2" }}>
                  {this.state.timestamp}
                </b>
              </p>
            </small>
          </div>
        </div>
      </div>
    );
  }
}

export default Convertor;
