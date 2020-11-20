import React, { Component } from "react";

class Temp extends Component {
  state = { text: "" };
  constructor(props) {
    super(props);
    const { text } = props;
    this.setState({ text: props.text });
  }
  render() {
    return <>{this.props.text}</>;
  }
}

export default Temp;
