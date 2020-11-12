import logo from "./logo.svg";
import "./App.css";
import React, { Component } from "react";

class App extends Component {
  state = {
    isLoaded: false,
    data: {},
    error: null,
  };
  fetchRates() {
    fetch("https://api.exchangeratesapi.io/latest?base=USD")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        this.setState({ isLoaded: true, data: res.rates });
      });
  }
  componentDidMount() {
    setInterval(() => this.fetchRates(), 1000);
  }
  constructor(props) {
    super(props);
  }
  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>{error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <>
          {Object.keys(this.state.data).map((key, index) => (
            <p key={index}>
              {key} {this.state.data[key]}
            </p>
          ))}
        </>
      );
    }
  }
}

export default App;
