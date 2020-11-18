import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default class Charts extends PureComponent {
  chartData = [];
  constructor(props) {
    super(props);
    const { data, timestamps } = props;
    let i = 0;
    timestamps.forEach((element) => {
      this.chartData.push({ name: element, pv: data[i] });
      i++;
    });
  }
  componentDidUpdate() {
    const { data, timestamps } = this.props;
    let i = 0;
    timestamps.forEach((element) => {
      this.chartData.push({ name: element, pv: data[i] });
      i++;
    });
  }
  render() {
    return (
      <LineChart
        width={500}
        height={300}
        data={this.chartData}
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
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    );
  }
}
