import React, { Component } from "react";
class Convertor extends Component {
  state = {
    base: "USD",
    quote: "INR",
    amount: 1,
    convert: 1,
    reverse: 1,
    timestamp: "",
    interbank: 0,
  };
  constructor(props) {
    super(props);
    this.setState({ base: props.base, quote: props.quote });
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
      e.target.value * this.state.convert * (1 - this.state.interbank / 100)
    ).toFixed(5);
  }
  handleReverseChange(e) {
    document.getElementById("convertFrom").value = Number(
      e.target.value * this.state.reverse * (1 + this.state.interbank / 100)
    ).toFixed(5);
  }
  handleSelectionChange(e) {
    this.setState({ interbank: e });
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
        <div className="row mt-2 mb-2">
          <div className="col-sm-6">
            Base: {this.state.base}
            <br />
            <small style={{ fontSize: "12px", color: "gray" }}>
              (Currency I have)
            </small>
            <input
              className="form-control mt-2"
              type="number"
              name="convertFrom"
              id="convertFrom"
              onChange={this.handleConvertChange}
            />
          </div>
          <div className="col-sm-6">
            Quote: {this.state.quote}
            <br />
            <small style={{ fontSize: "12px", color: "gray" }}>
              (Currency I want)
            </small>
            <input
              className="form-control mt-2"
              type="number"
              name="convertTo"
              id="convertTo"
              onChange={this.handleReverseChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 mt-3 mb-2 ml-1">
            Interbank rate for conversion (+/-):
            <button
              className="btn btn-info btn-sm dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {this.state.interbank} % {"  "}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a
                className="dropdown-item"
                onClick={() => {
                  this.handleSelectionChange(0);
                }}
              >
                +/- 0%
              </a>
              <a
                className="dropdown-item"
                onClick={() => {
                  this.handleSelectionChange(1);
                }}
              >
                +/- 1%
              </a>
              <a
                className="dropdown-item"
                onClick={() => {
                  this.handleSelectionChange(2);
                }}
              >
                +/- 2% (Typical ATM Rate)
              </a>
              <a
                className="dropdown-item"
                onClick={() => {
                  this.handleSelectionChange(3);
                }}
              >
                +/- 3% (Typical Credit Card Rate)
              </a>
              <a
                className="dropdown-item"
                onClick={() => {
                  this.handleSelectionChange(4);
                }}
              >
                +/- 4%
              </a>
              <a
                className="dropdown-item"
                onClick={() => {
                  this.handleSelectionChange(5);
                }}
              >
                +/- 5% (Typical Kiosk Rate)
              </a>
            </div>
            <br />
            <br />
            <br />
            <small style={{ fontSize: "15px" }} className="text-muted text-sm">
              The Conversion Rate for{" "}
              <small style={{ color: "white" }}>{this.state.base}</small> -&gt;{" "}
              <small style={{ color: "white" }}>{this.state.quote}</small> is:{" "}
              <small style={{ color: "white" }}>{this.state.convert}</small>{" "}
              <br />
              The Conversion Rate for{" "}
              <small style={{ color: "white" }}>
                {this.state.quote}
              </small> -&gt;{" "}
              <small style={{ color: "white" }}>{this.state.base}</small> is:{" "}
              <small style={{ color: "white" }}>{this.state.reverse}</small>
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
