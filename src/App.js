import "./App.css";
import React, { Component } from "react";
import Convertor from "./Convertor";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
class App extends Component {
  state = {
    isLoaded: false,
    data: { rates: { "": { rate: "" } } },
    error: null,
    history: {
      USDINR: [0.0],
      AUDUSD: [0.0],
      EURGBP: [0.0],
      EURUSD: [0.0],
      GBPUSD: [0.0],
      NZDUSD: [0.0],
      USDAED: [0.0],
    },
    timestamps: [0.0],
    chartData: [],
  };
  maxval = 0;
  maxkey = "USDINR";
  minkey = "";
  minval = 99999;
  fetchRates() {
    let urlLink =
      "http://localhost:3001/getPair/USDINR,AUDUSD,EURGBP,EURUSD,GBPUSD,NZDUSD,USDAED";

    fetch(urlLink)
      .then((res) => res.json())
      .then((res) => {
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            const element = res[key];
            if (this.state.history[key].length > 5) {
              this.state.history[key].shift();
              this.state.timestamps.shift();
            }
            this.state.history[key].push(element);
            if (this.maxval < element) {
              this.maxval = element;
              this.maxkey = key;
            }
            if (this.minval > element) {
              this.minval = element;
              this.minkey = key;
            }
          }
        }
      })
      .then(() => {
        this.state.timestamps.push(new Date().getTime());
        this.state.chartData = [];
        for (var i = 0; i < 5; i++) {
          this.state.chartData.push({
            name: this.state.timestamps[i],
            AUDUSD: this.state.history.AUDUSD[i],
          });
        }
        this.setState({ isLoaded: true });
      });
  }
  componentDidMount() {
    try {
      setInterval(async () => {
        this.fetchRates();
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      return <div>{error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <b>BEST:</b> {this.maxkey} {this.maxval} &nbsp;&nbsp;
              <b>WORST: </b> {this.minkey} {this.minval}
            </div>
          </div>
          <div className="row">
            {Object.keys(this.state.history).map((key, index) => (
              <div className="col-sm-2" key={index}>
                <p className="rateHead">{key}</p>
                <ul className="ratesList">
                  {this.state.history[key].map((e, i) => (
                    <li key={i} className="ratesListItem">
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-sm-6">
              <Convertor />
            </div>
            <div className="col-sm-6">
              <LineChart
                width={500}
                height={300}
                data={this.state.chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="AUDUSD"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default App;
