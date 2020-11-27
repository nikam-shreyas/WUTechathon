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
  data: [
    { date: "1/11/20", best_rate: 1.79, worst_rate: 0.4 },
    { date: "2/11/20", best_rate: 2.39, worst_rate: 1.24 },
    { date: "3/11/20", best_rate: 1.37, worst_rate: 1.29 },
    { date: "4/11/20", best_rate: 1.16, worst_rate: 0.57 },
    { date: "5/11/20", best_rate: 2.29, worst_rate: 0.76 },
    { date: "6/11/20", best_rate: 3, worst_rate: 1 },
    { date: "7/11/20", best_rate: 0.53, worst_rate: 0.02 },
    { date: "8/11/20", best_rate: 2.52, worst_rate: 1.2 },
    { date: "9/11/20", best_rate: 1.79, worst_rate: 0.89 },
    { date: "10/11/20", best_rate: 2.94, worst_rate: 1.19 },
    { date: "11/11/20", best_rate: 4.3, worst_rate: 2.0 },
    { date: "12/11/20", best_rate: 4.41, worst_rate: 1 },
    { date: "13/11/20", best_rate: 2.1, worst_rate: 1.0 },
    { date: "14/11/20", best_rate: 8, worst_rate: 3 },
    { date: "15/11/20", best_rate: 4, worst_rate: 1 },
    { date: "16/11/20", best_rate: 9, worst_rate: 2 },
    { date: "17/11/20", best_rate: 3, worst_rate: 1 },
    { date: "18/11/20", best_rate: 2, worst_rate: 0 },
    { date: "19/11/20", best_rate: 3, worst_rate: 1.47 },
    { date: "20/11/20", best_rate: 7, worst_rate: 2.09 },
  ],
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
      "http://localhost:5000/getHistory?start=" +
        this.state.fromDate +
        "&end=" +
        this.state.toDate +
        "&pair=" +
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
    var json = this.state.data;
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
      <div className="container-fluid">
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
                {list.map((e) => (
                  <a
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
          <ResponsiveContainer width="100%" height={250}>
            <LineChart width={800} height={250} data={this.state.data}>
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
                name="Daily Best Rate"
                dataKey="best_rate"
                stroke="#27A345"
                animationDuration={300}
              />
              <Line
                yAxisId="1"
                type="natural"
                name="Daily Worst Rate"
                dataKey="worst_rate"
                stroke="#B93249"
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
          <br />
         
        </div>
      </div>
    );
  }
}

export default HistoricalGraph;
