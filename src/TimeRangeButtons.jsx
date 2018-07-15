import React, { Component } from 'react';

class TimeRangeButtons extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (

      <div>
        <button name="1m" onClick={this.props.selectTimeRange}>1 Month</button>
        <button name="6m" onClick={this.props.selectTimeRange}>6 Months</button>
        <button name="1y" onClick={this.props.selectTimeRange}>1 Year</button>
        <button name="5y" onClick={this.props.selectTimeRange}>5 Years</button>
      </div>

    );
  }

}

export default TimeRangeButtons;