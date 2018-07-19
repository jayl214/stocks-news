import React, { Component } from 'react';

class TimeRangeButtons extends Component {

  activateButton = (event) => {
    this.props.selectTimeRange(event)
  }

  render() {
    return (

      <div className="btn-group-timeRange">
        <button className="btn btn-timeRange-1m" name="1m" onClick={this.activateButton}>1 Month</button>
        <button className="btn btn-timeRange-6m" name="6m" onClick={this.activateButton}>6 Months</button>
        <button className="btn btn-timeRange-1y" name="1y" onClick={this.activateButton}>1 Year</button>
        <button className="btn btn-timeRange-5y" name="5y" onClick={this.activateButton}>5 Years</button>
      </div>

    );
  }

}

export default TimeRangeButtons;