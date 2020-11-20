import React, { Component } from "react";
class LiveRates extends Component {
  state = {
    isLoaded: false,
    topFour: [],
    rates: [
      { name: "a", rate: 0, status: "danger" },
      { name: "a", rate: 0, status: "danger" },
      { name: "a", rate: 0, status: "danger" },
      { name: "a", rate: 0, status: "danger" },
    ],
  };
  constructor(props) {
    super(props);
    this.fetchRates = this.fetchRates.bind(this);
  }
  fetchRates() {
    setInterval(() => {
      fetch(
        "http://localhost:3003/getPair/" +
          this.state.topFour[0] +
          "," +
          this.state.topFour[1] +
          "," +
          this.state.topFour[2] +
          "," +
          this.state.topFour[3]
      )
        .then((res) => res.json())
        .then((res) => {
          let temp = [];
          let i = 0;
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              let tempStat =
                this.state.rates[i]["rate"] > res[key] ? "success" : "danger";
              temp.push({ name: key, rate: res[key], status: tempStat });
            }
            i += 1;
          }
          this.setState({ rates: temp });
          this.setState({ isLoaded: true });
        });
    }, 15000);
  }
  componentDidMount() {
    fetch("http://localhost:3003/getTop")
      .then((res) => res.json())
      .then((res) => {
        this.setState({ topFour: res });
      })
      .then(this.fetchRates());
  }
  render() {
    if (this.state.isLoaded) {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3 rateDisplay">
              <h3>{this.state.rates[0].name}</h3>
              <small className={"text-" + this.state.rates[0].status}>
                {this.state.rates[0].rate}
              </small>
            </div>
            <div className="col-sm-3 rateDisplay">
              <h3>{this.state.rates[1].name}</h3>
              <small className={"text-" + this.state.rates[1].status}>
                {this.state.rates[1].rate}
              </small>
            </div>
            <div className="col-sm-3 rateDisplay">
              <h3>{this.state.rates[2].name}</h3>
              <small className={"text-" + this.state.rates[2].status}>
                {this.state.rates[2].rate}
              </small>
            </div>
            <div className="col-sm-3 rateDisplay">
              <h3>{this.state.rates[3].name}</h3>
              <small className={"text-" + this.state.rates[3].status}>
                {this.state.rates[3].rate}
              </small>
            </div>
          </div>
        </div>
      );
    } else {
      return <>Loading...</>;
    }
  }
}

export default LiveRates;
