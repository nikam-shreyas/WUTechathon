import {
  Label,
  AreaChart,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import React, { Component } from "react";
import { FaDownload } from "react-icons/fa";
import { list } from "../Helper/List";

const initialState = {
  data: {
    eAvg: 74.23199,
    eMax: 74.68917,
    eMin: 73.75074,
    fAvg: 74.26988,
    fMax: 74.91981,
    fMin: 73.58576,
    list: [
      {
        date: "2020-11-02",
        exchangeRateApi: 74.45546,
        fixerIo: 74.71355,
        randomApi: 74.73739,
      },
      {
        date: "2020-11-03",
        exchangeRateApi: 74.40566,
        fixerIo: 73.93616,
        randomApi: 74.77003,
      },
      {
        date: "2020-11-04",
        exchangeRateApi: 74.39254,
        fixerIo: 74.03445,
        randomApi: 74.38915,
      },
      {
        date: "2020-11-05",
        exchangeRateApi: 74.01139,
        fixerIo: 73.81047,
        randomApi: 74.00777,
      },
      {
        date: "2020-11-06",
        exchangeRateApi: 74.14364,
        fixerIo: 74.04037,
        randomApi: 74.00393,
      },
      {
        date: "2020-11-09",
        exchangeRateApi: 73.75074,
        fixerIo: 73.58576,
        randomApi: 73.62186,
      },
      {
        date: "2020-11-10",
        exchangeRateApi: 74.24331,
        fixerIo: 74.02521,
        randomApi: 74.25482,
      },
      {
        date: "2020-11-11",
        exchangeRateApi: 74.41951,
        fixerIo: 74.28252,
        randomApi: 74.43386,
      },
      {
        date: "2020-11-12",
        exchangeRateApi: 74.68917,
        fixerIo: 74.64843,
        randomApi: 74.42868,
      },
      {
        date: "2020-11-13",
        exchangeRateApi: 74.63902,
        fixerIo: 74.23406,
        randomApi: 74.24795,
      },
      {
        date: "2020-11-16",
        exchangeRateApi: 74.45435,
        fixerIo: 74.91981,
        randomApi: 74.85222,
      },
      {
        date: "2020-11-17",
        exchangeRateApi: 74.46768,
        fixerIo: 74.89152,
        randomApi: 74.6961,
      },
      {
        date: "2020-11-18",
        exchangeRateApi: 74.15824,
        fixerIo: 74.5095,
        randomApi: 74.40259,
      },
      {
        date: "2020-11-19",
        exchangeRateApi: 74.20301,
        fixerIo: 74.29499,
        randomApi: 74.36263,
      },
      {
        date: "2020-11-20",
        exchangeRateApi: 74.13049,
        fixerIo: 74.39453,
        randomApi: 73.90655,
      },
      {
        date: "2020-11-23",
        exchangeRateApi: 74.03075,
        fixerIo: 74.3368,
        randomApi: 74.45988,
      },
      {
        date: "2020-11-24",
        exchangeRateApi: 74.08723,
        fixerIo: 74.53711,
        randomApi: 73.84515,
      },
      {
        date: "2020-11-25",
        exchangeRateApi: 73.88898,
        fixerIo: 73.95804,
        randomApi: 74.25654,
      },
      {
        date: "2020-11-26",
        exchangeRateApi: 73.83655,
        fixerIo: 73.97443,
        randomApi: 74.21473,
      },
    ],
    rAvg: 74.3101,
    rMax: 74.85222,
    rMin: 73.62186,
  },
  left: "dataMin",
  right: "dataMax",
  refAreaLeft: "",
  refAreaRight: "",
  top: "dataMax+1",
  bottom: "dataMin-1",
  top2: "dataMax+20",
  bottom2: "dataMin-20",
  animation: true,
  fromDate: new Date("11/1/2020").getTime(),
  toDate: new Date().getTime(),
  selection: "USDINR",
};

class HistoricalGraph extends Component {
  constructor() {
    super();
    this.state = initialState;
    this.fetchData = this.fetchData.bind(this);
    this.getAxisYDomain = this.getAxisYDomain.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.downloadData = this.downloadData.bind(this);
    this.JSON2CSV = this.JSON2CSV.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }
  getAxisYDomain = (from, to, ref, offset) => {
    let tempfrom =
      (new Date(from).getTime() -
        new Date(this.state.data[0].timestamp).getTime()) /
      86400000;
    let tempto =
      (new Date(to).getTime() -
        new Date(this.state.data[0].timestamp).getTime()) /
      86400000;
    const refData = this.state.data.slice(tempto - 1, tempfrom);
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });

    return [(bottom | 0) - offset, (top | 0) + offset];
  };

  handleFromDateChange(event) {
    this.setState({ fromDate: new Date(event.target.value).getTime() });
  }

  handleToDateChange(event) {
    this.setState({ toDate: new Date(event.target.value).getTime() });
  }

  fetchData() {
    fetch(
      "http://localhost:5000/history?start_date=" +
        this.state.fromDate +
        "&end_date=" +
        this.state.toDate +
        "&selection=" +
        this.state.selection,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Qrigin": "*",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({ data: res });
      });
  }

  handleSelectionChange(selection) {
    this.setState({ selection: selection["e"] });
    this.fetchData();
  }
  JSON2CSV(objArray) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";
    var line = "";

    if (true) {
      var head = array[0];
      if (true) {
        for (var index in array[0]) {
          var value = index + "";
          line += '"' + value.replace(/"/g, '""') + '",';
        }
      } else {
        for (var index in array[0]) {
          line += index + ",";
        }
      }

      line = line.slice(0, -1);
      str += line + "\r\n";
    }

    for (var i = 0; i < array.length; i++) {
      var line = "";

      if (true) {
        for (var index in array[i]) {
          var value = array[i][index] + "";
          line += '"' + value.replace(/"/g, '""') + '",';
        }
      } else {
        for (var index in array[i]) {
          line += array[i][index] + ",";
        }
      }

      line = line.slice(0, -1);
      str += line + "\r\n";
    }
    return str;
  }
  downloadData() {
    var json = this.state.data["list"];
    var csv = this.JSON2CSV(json);
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", csv]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download =
      this.state.selection +
      "_" +
      this.state.fromDate +
      "_" +
      this.state.toDate +
      ".csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  render() {
    const {
      data,
      barIndex,
      left,
      right,
      refAreaLeft,
      refAreaRight,
      top,
      bottom,
      top2,
      bottom2,
    } = this.state;

    return (
      <div>
        <div className="historical-header">
          <div className="row">
            <div className="col-sm-12">
              <button
                className="btn btn-secondary btn-sm dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {this.state.selection.slice(0, 3) +
                  "/" +
                  this.state.selection.slice(3, 6) +
                  " "}
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                {list.map((e, i) => (
                  <a
                    key={i}
                    className="dropdown-item"
                    onClick={() => {
                      this.handleSelectionChange({ e });
                    }}
                  >
                    {e}
                  </a>
                ))}
              </div>
              <small
                style={{
                  float: "right",
                  cursor: "pointer",
                  left: "10px",
                }}
              >
                From{" "}
                <input
                  type="date"
                  name="fromDate"
                  className="form-control1"
                  style={{ padding: "-10px", margin: "0px", fill: "white" }}
                  onChange={this.handleFromDateChange}
                />{" "}
                To{" "}
                <input
                  type="date"
                  name="toDate"
                  className="form-control1"
                  onChange={this.handleToDateChange}
                />
                <button
                  className="btn btn-sm btn-outline-info ml-2 mr-2"
                  style={{
                    padding: "1px",
                    paddingLeft: "3px",
                    paddingRight: "3px",
                    fontSize: "12px",
                  }}
                  onClick={this.fetchData}
                >
                  Fetch Data
                </button>
                <FaDownload
                  size={15}
                  fill="#17A2B8"
                  onClick={this.downloadData}
                />{" "}
              </small>
            </div>
          </div>
        </div>
        <div className="container-fluid mt-2">
          <div className="row">
            <div className="col-sm-7">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  width={800}
                  height={200}
                  data={this.state.data["list"]}
                >
                  <XAxis
                    allowDataOverflow
                    dataKey="date"
                    domain={[left, right]}
                    type="category"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    allowDataOverflow
                    domain={[bottom, top]}
                    yAxisId="1"
                    tick={{ fontSize: 8, fill: "white" }}
                  />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line
                    yAxisId="1"
                    type="natural"
                    name="exchangeRateApi"
                    dataKey="exchangeRateApi"
                    stroke="red"
                    animationDuration={300}
                  />
                  <Line
                    yAxisId="1"
                    type="natural"
                    name="fixer.io"
                    dataKey="fixerIo"
                    stroke="green"
                    animationDuration={300}
                  />
                  <Line
                    yAxisId="1"
                    type="natural"
                    name="randomApi"
                    dataKey="randomApi"
                    stroke="blue"
                    animationDuration={300}
                  />
                  {refAreaLeft && refAreaRight ? (
                    <ReferenceArea
                      yAxisId="1"
                      x1={refAreaLeft}
                      x2={refAreaRight}
                      strokeOpacity={0.3}
                    />
                  ) : null}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="col-sm-5">
              <div
                className="container ratesTable mt-4"
                style={{ height: "100%", float: "left", fontSize: "15px" }}
              >
                <table className="table-border">
                  <tr className="ratesHeader" style={{ color: "#49AFF2" }}>
                    <th></th>
                    <th>Min.</th>
                    <th>Avg.</th>
                    <th>Max.</th>
                  </tr>
                  <tr className="ratesItem" style={{ fontSize: "15px" }}>
                    <td style={{ color: "#49AFF2" }}>Exchange Rates Api</td>
                    <td style={{ color: "white" }}>
                      {this.state.data["eMin"]}
                    </td>
                    <td style={{ color: "white" }}>
                      {this.state.data["eAvg"]}
                    </td>
                    <td style={{ color: "white" }}>
                      {this.state.data["eMax"]}
                    </td>
                  </tr>
                  <tr className="ratesItem" style={{ fontSize: "15px" }}>
                    <td style={{ color: "#49AFF2" }}>Fixer.io</td>
                    <td style={{ color: "white" }}>
                      {this.state.data["fMin"]}
                    </td>
                    <td style={{ color: "white" }}>
                      {this.state.data["fAvg"]}
                    </td>
                    <td style={{ color: "white" }}>
                      {this.state.data["fMax"]}
                    </td>
                  </tr>
                  <tr className="ratesItem" style={{ fontSize: "15px" }}>
                    <td style={{ color: "#49AFF2" }}>Random Api</td>
                    <td style={{ color: "white" }}>
                      {this.state.data["rMin"]}
                    </td>
                    <td style={{ color: "white" }}>
                      {this.state.data["rAvg"]}
                    </td>
                    <td style={{ color: "white" }}>
                      {this.state.data["rMax"]}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HistoricalGraph;
