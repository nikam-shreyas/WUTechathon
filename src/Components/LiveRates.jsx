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
      fetch("http://localhost:5000/getTop", {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Qrigin": "*",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          let temp = [];
          let i = 0;
          res.forEach((element) => {
            for (const key in element) {
              if (element.hasOwnProperty(key)) {
                let tempStat =
                  this.state.rates[i]["rate"] > element[key]
                    ? "success"
                    : "danger";
                temp.push({ name: key, rate: element[key], status: tempStat });
              }
              i += 1;
            }
          });

          this.setState({ rates: temp });
          this.setState({ isLoaded: true });
        });
    }, 3000);
  }
  componentDidMount() {
    this.fetchRates();
  }
  render() {
    if (this.state.isLoaded) {
      return (
        <div>
          <div className="historical-header">Top Rates</div>
          <div className="container">
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
        </div>
      );
    } else {
      return <>Loading...</>;
    }
  }
}

export default LiveRates;
