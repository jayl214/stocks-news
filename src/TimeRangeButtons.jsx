import React, { Component } from 'react';

class TimeRangeButtons extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (

      <div>
        <button name="1m">1 Month</button>
        <button name="6m">6 Months</button>
        <button name="1y">1 Year</button>
        <button name="5y">5 Years</button>
      </div>

    );
  }

}

export default TimeRangeButtons;