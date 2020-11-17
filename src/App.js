import "./App.css";
import React, { Component } from "react";
import Convertor from "./Convertor";
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
  };
  maxval = 0;
  maxkey = "USDINR";
  fetchRates() {
    let urlLink =
      "https://cors-anywhere.herokuapp.com/www.freeforexapi.com/api/live?pairs=USDINR,AUDUSD,EURGBP,EURUSD,GBPUSD,NZDUSD,USDAED";
    setInterval(
      60000,
      fetch(urlLink)
        .then((res) => res.json())
        .then((res) => {
          for (const key in res.rates) {
            if (res.rates.hasOwnProperty(key)) {
              const element = res.rates[key]["rate"];
              if (this.state.history[key].length > 5) {
                this.state.history[key].shift();
              }
              this.state.history[key].push(element);
              if (this.maxval < element) {
                this.maxval = element;
                this.maxkey = key;
              }
            }
          }
        })
        .then(() => {
          this.setState({ isLoaded: true });
        })
    );
  }
  componentDidMount() {
    try {
      setInterval(async () => {
        this.fetchRates();
      }, 15000);
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
              {this.maxkey} {this.maxval}
            </div>
          </div>
          <div className="row">
            {Object.keys(this.state.history).map((key, index) => (
              <div className="col-sm-2" key={index}>
                <p className="rateHead">{key}</p>
                <ul className="ratesList">
                  {this.state.history[key].map((e) => (
                    <li className="ratesListItem">{e}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="row">{/* <Convertor /> */}</div>
        </div>
      );
    }
  }
}

export default App;
