import React, { Component } from "react";

class Predictions extends Component {
  state = {
    todays: {
      USDEUR: 0.9455,
      USDGBP: 1.73834,
      USDINR: 74.80968,
      USDJPY: 104.27289,
    },
    res: [73.599, 0.836, 0.749, 97.117],
    timestamp: new Date().toLocaleString(),
  };
  componentDidMount() {
    fetch("http:localhost:5000/getPair?pair=USDINR,USDEUR,USDGBP,USDJPY")
      .then((res) => res.json())
      .then((res) => {
        this.setState({ todays: res });
        fetch(
          "http://localhost:5000/enter_rate?USDINR=" +
            res["USDINR"] +
            "&USDEUR=" +
            res["USDEUR"] +
            "&USDGBP=" +
            res["USDGBP"] +
            "&USDYEN=" +
            res["USDYEN"]
        )
          .then((res) => res.json())
          .then((res) => {
            this.setState({ res: res["result"] });
          });
      });
  }
  render() {
    return (
      <div>
        <div className="historical-header">Predictions for Tomorrow:</div>
        <div className="ratesTable m-1" style={{ height: "100%" }}>
          <table>
            <tr className="ratesHeader mb-2">
              <th>Currency</th>
              <th>Today's Rate</th>
              <th>Tomorrow's Predictions</th>
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
            </tr>
            <tr className="ratesItem">
              <td>USDINR</td>
              <td>{this.state.todays["USDINR"]}</td>
              <td style={{ color: "cyan" }}>{this.state.res[0]}</td>
            </tr>
            <tr className="ratesItem">
              <td>USDEUR</td>
              <td>{this.state.todays["USDEUR"]}</td>
              <td style={{ color: "cyan" }}>{this.state.res[1]}</td>
            </tr>
            <tr className="ratesItem">
              <td>USDGBP</td>
              <td>{this.state.todays["USDGBP"]}</td>
              <td style={{ color: "cyan" }}>{this.state.res[2]}</td>
            </tr>
            <tr className="ratesItem">
              <td>USDJPY</td>
              <td>{this.state.todays["USDJPY"]}</td>
              <td style={{ color: "cyan" }}>{this.state.res[3]}</td>
            </tr>
          </table>
          <br />
          <small className="mt-2">Timestamp: {this.state.timestamp}</small>
        </div>
      </div>
    );
  }
}

export default Predictions;
