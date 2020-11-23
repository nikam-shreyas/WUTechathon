import React, { Component } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
class LiveGraph extends Component {
  state = {
    selection: "USDINR",
    history: [{ name: "", value: 0.0 }],
  };
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.setState({
      selection: props.selection,
    });
  }
  fetchData() {
    setInterval(() => {
      let urlLink =
        "http://localhost:5000/getPair?pair=" + this.props.selection;
      fetch(urlLink, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Qrigin": "*",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (this.state.history.length > 10) {
            this.state.history.shift();
          }
          let time = new Date();
          let t =
            time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
          this.setState((prev) => ({
            history: [
              ...prev.history,
              {
                name: t,
                value: res[this.props.selection],
              },
            ],
          }));
        });
    }, 5000);
  }
  componentDidMount() {
    this.fetchData();
  }
  render() {
    return (
      <div className="m-2">
        <center>
          <small className="text-muted">Live Rates:</small>{" "}
        </center>
        {/* {this.state.history[this.state.history.length - 1]["uv"]} */}
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart
            width={730}
            height={150}
            data={this.state.history}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2F6394" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2F6394" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" allowDataOverflow tick={{ fontSize: 10 }} />
            <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default LiveGraph;
