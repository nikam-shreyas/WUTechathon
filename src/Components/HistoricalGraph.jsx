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

const initialState = {
  data: [
    { timestamp: 1, bestRate: 1.79, worstRate: 200 },
    { timestamp: 2, bestRate: 2.39, worstRate: 120 },
    { timestamp: 3, bestRate: 1.37, worstRate: 150 },
    { timestamp: 4, bestRate: 1.16, worstRate: 180 },
    { timestamp: 5, bestRate: 2.29, worstRate: 200 },
    { timestamp: 6, bestRate: 3, worstRate: 499 },
    { timestamp: 7, bestRate: 0.53, worstRate: 50 },
    { timestamp: 8, bestRate: 2.52, worstRate: 100 },
    { timestamp: 9, bestRate: 1.79, worstRate: 200 },
    { timestamp: 10, bestRate: 2.94, worstRate: 222 },
    { timestamp: 11, bestRate: 4.3, worstRate: 210 },
    { timestamp: 12, bestRate: 4.41, worstRate: 300 },
    { timestamp: 13, bestRate: 2.1, worstRate: 50 },
    { timestamp: 14, bestRate: 8, worstRate: 190 },
    { timestamp: 15, bestRate: 0, worstRate: 300 },
    { timestamp: 16, bestRate: 9, worstRate: 400 },
    { timestamp: 17, bestRate: 3, worstRate: 200 },
    { timestamp: 18, bestRate: 2, worstRate: 50 },
    { timestamp: 19, bestRate: 3, worstRate: 100 },
    { timestamp: 20, bestRate: 7, worstRate: 100 },
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
  constructor(props) {
    super(props);
    this.setState({ selection: props.selection });
    this.state = initialState;
    this.fetchData = this.fetchData.bind(this);
    this.zoom = this.zoom.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.getAxisYDomain = this.getAxisYDomain.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ selection: nextProps.selection });
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

  zoom() {
    let { refAreaLeft, refAreaRight, data } = this.state;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      this.setState(() => ({
        refAreaLeft: "",
        refAreaRight: "",
      }));
      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight)
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    // yAxis domain
    const [bottom, top] = this.getAxisYDomain(
      refAreaLeft,
      refAreaRight,
      "bestRate",
      1
    );
    const [bottom2, top2] = this.getAxisYDomain(
      refAreaLeft,
      refAreaRight,
      "worstRate",
      20
    );

    this.setState(() => ({
      refAreaLeft: "",
      refAreaRight: "",
      data: this.state.data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      bottom,
      top,
      bottom2,
      top2,
    }));
  }
  handleFromDateChange(event) {
    this.setState({ fromDate: new Date(event.target.value).getTime() });
  }

  handleToDateChange(event) {
    this.setState({ toDate: new Date(event.target.value).getTime() });
  }
  zoomOut() {
    const { data } = this.state;
    this.setState(() => ({
      data: data.slice(),
      refAreaLeft: "",
      refAreaRight: "",
      left: "dataMin",
      right: "dataMax",
      top: "dataMax+1",
      bottom: "dataMin",
      top2: "dataMax+50",
      bottom: "dataMin+50",
    }));
  }
  fetchData() {
    fetch(
      "http://localhost:3001/getHistory/" +
        this.state.fromDate +
        "," +
        this.state.toDate +
        "," +
        this.state.selection
    )
      .then((res) => res.json())
      .then((res) => this.setState({ data: res }))
      .then(console.log(this.state.data));
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
      <div className="container">
        <center>
          {this.state.selection.slice(0, 3) +
            "/" +
            this.state.selection.slice(3, 6)}
        </center>
        <div className="container-fluid">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              width={800}
              height={250}
              data={this.state.data}
              onMouseDown={(e) => this.setState({ refAreaLeft: e.activeLabel })}
              onMouseMove={(e) =>
                this.state.refAreaLeft &&
                this.setState({ refAreaRight: e.activeLabel })
              }
              onMouseUp={this.zoom.bind(this)}
            >
              <XAxis
                allowDataOverflow
                dataKey="timestamp"
                domain={[left, right]}
                type="category"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                allowDataOverflow
                domain={[bottom, top]}
                yAxisId="1"
                tick={{ fontSize: 8 }}
              />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Line
                yAxisId="1"
                type="natural"
                name="Daily Best Rate"
                dataKey="bestRate"
                stroke="#27A345"
                animationDuration={300}
              />
              <Line
                yAxisId="1"
                type="natural"
                name="Daily Worst Rate"
                dataKey="worstRate"
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
          <a
            href="javascript: void(0);"
            style={{ float: "right" }}
            className="btn btn-outline-secondary btn-sm"
            onClick={this.zoomOut.bind(this)}
          >
            Zoom Out
          </a>
          <br />
          From{" "}
          <input
            type="date"
            name="fromDate"
            onChange={this.handleFromDateChange}
          />{" "}
          To{" "}
          <input type="date" name="toDate" onChange={this.handleToDateChange} />
          <button className="btn btn-sm ml-2 btn-info" onClick={this.fetchData}>
            Fetch Data
          </button>
        </div>
      </div>
    );
  }
}

export default HistoricalGraph;
