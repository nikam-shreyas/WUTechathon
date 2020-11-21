import React, { Component } from "react";
class Convertor extends Component {
  constructor(props) {
    super(props);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.convert = this.convert.bind(this);
  }
  state = {
    from: "",
    to: "",
    amount: "",
    list: [
      "AUD",
      "USD",
      "EUR",
      "GBP",
      "NZD",
      "AED",
      "AFN",
      "ALL",
      "AMD",
      "ANG",
      "AOA",
      "ARS",
      "ATS",
      "AWG",
      "AZM",
      "AZN",
      "BAM",
      "BBD",
      "BDT",
      "BEF",
      "BGN",
      "BHD",
      "BIF",
      "BMD",
      "BND",
      "BOB",
      "BRL",
      "BSD",
      "BTN",
      "BWP",
      "BYN",
      "BYR",
      "BZD",
      "CAD",
      "CDF",
      "CHF",
      "CLP",
      "CNH",
      "CNY",
      "COP",
      "CRC",
      "CUC",
      "CUP",
      "CVE",
      "CYP",
      "CZK",
      "DEM",
      "DJF",
      "DKK",
      "DOP",
      "DZD",
      "EEK",
      "EGP",
      "ERN",
      "ESP",
      "ETB",
      "FIM",
      "FJD",
      "FKP",
      "FRF",
      "GEL",
      "GGP",
      "GHC",
      "GHS",
      "GIP",
      "GMD",
      "GNF",
      "GRD",
      "GTQ",
      "GYD",
      "HKD",
      "HNL",
      "HRK",
      "HTG",
      "HUF",
      "IDR",
      "IEP",
      "ILS",
      "IMP",
      "INR",
      "IQD",
      "IRR",
      "ISK",
      "ITL",
      "JEP",
      "JMD",
      "JOD",
      "JPY",
      "KES",
      "KGS",
      "KHR",
      "KMF",
      "KPW",
      "KRW",
      "KWD",
      "KYD",
      "KZT",
      "LAK",
      "LBP",
      "LKR",
      "LRD",
      "LSL",
      "LTL",
      "LUF",
      "LVL",
      "LYD",
      "MAD",
      "MDL",
      "MGA",
      "MGF",
      "MKD",
      "MMK",
      "MNT",
      "MOP",
      "MRO",
      "MRU",
      "MTL",
      "MUR",
      "MVR",
      "MWK",
      "MXN",
      "MYR",
      "MZM",
      "MZN",
      "NAD",
      "NGN",
      "NIO",
      "NLG",
      "NOK",
      "NPR",
      "OMR",
      "PAB",
      "PEN",
      "PGK",
      "PHP",
      "PKR",
      "PLN",
      "PTE",
      "PYG",
      "QAR",
      "ROL",
      "RON",
      "RSD",
      "RUB",
      "RWF",
      "SAR",
      "SBD",
      "SCR",
      "SDD",
      "SDG",
      "SEK",
      "SGD",
      "SHP",
      "SIT",
      "SKK",
      "SLL",
      "SOS",
      "SPL",
      "SRD",
      "SRG",
      "STD",
      "STN",
      "SVC",
      "SYP",
      "SZL",
      "THB",
      "TJS",
      "TMM",
      "TMT",
      "TND",
      "TOP",
      "TRL",
      "TRY",
      "TTD",
      "TVD",
      "TWD",
      "TZS",
      "UAH",
      "UGX",
      "UYU",
      "UZS",
      "VAL",
      "VEB",
      "VEF",
      "VES",
      "VND",
      "VUV",
      "WST",
      "XAF",
      "XAG",
      "XAU",
      "XBT",
      "XCD",
      "XDR",
      "XOF",
      "XPD",
      "XPF",
      "XPT",
      "YER",
      "ZAR",
      "ZMK",
      "ZMW",
      "ZWD",
    ],
  };
  handleAmountChange(event) {
    this.setState({ amount: event.target.value });
  }
  handleFromChange(event) {
    this.setState({ from: event.target.value });
  }
  handleToChange(event) {
    this.setState({ to: event.target.value });
  }
  convert(event) {
    if (this.state.from === this.state.to) {
      document.getElementById("result").innerHTML =
        "Rate: 1 <br /> Result: " + this.state.amount;
    } else {
      let conversion = "" + this.state.from + this.state.to;
      let urlLink = "http://localhost:5000/getPair/" + conversion;
      fetch(urlLink)
        .then((res) => res.json())
        .then((res) => {
          let factor = Number(res[conversion]);
          if (res[conversion] === 0) {
            document.getElementById("result").innerHTML =
              "<small class='text-danger'>Cannot provide Conversion Rate for the specified exchange.</small>";
          } else {
            document.getElementById("result").innerHTML =
              "Rate: " +
              res[conversion] +
              "<br />Result: " +
              Number(factor) * Number(this.state.amount);
          }
        });
    }
  }
  render() {
    return (
      <>
        <div className="container">
          <h5>Convertor</h5>
          <select
            name="from"
            className="custom-select"
            id="from"
            onChange={this.handleFromChange}
            required
          >
            {this.state.list.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          To
          <select
            name="to"
            id="to"
            onChange={this.handleToChange}
            className="custom-select"
            required
          >
            {this.state.list.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          Amount: <br />
          <input
            type="number"
            name="amount"
            id="amount"
            placeholder="Amount"
            className="input"
            onChange={this.handleAmountChange}
            required
          />
          <button className="btn btn-primary" onClick={this.convert}>
            Convert
          </button>
          <div id="result"></div>
        </div>
      </>
    );
  }
}

export default Convertor;
