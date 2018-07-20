import React, { Component } from 'react';

class TimeRangeButtons extends Component {

  activateButton = (event) => {
    this.props.selectTimeRange(event)
  }

  //super gross brute force code, need to figure out how to refactor later...
  is1mActive = () => {
    if(this.props.timeRange === '1m'){
      return 'btn-active'
    }else {
      return 'btn-not-active'
    }
  }
  is6mActive = () => {
    if(this.props.timeRange === '6m'){
      return 'btn-active'
    }else {
      return 'btn-not-active'
    }
  }
  is1yActive = () => {
    if(this.props.timeRange === '1y'){
      return 'btn-active'
    }else {
      return 'btn-not-active'
    }
  }
  is5yActive = () => {
    if(this.props.timeRange === '5y'){
      return 'btn-active'
    }else {
      return 'btn-not-active'
    }
  }

  render() {
    return (

      <div className="btn-group-timeRange">
        <button className={`btn btn-timeRange-1m ${this.is1mActive()}`} name="1m" onClick={this.activateButton}>1 Month</button>
        <button className={`btn btn-timeRange-6m ${this.is6mActive()}`} name="6m" onClick={this.activateButton}>6 Months</button>
        <button className={`btn btn-timeRange-1y ${this.is1yActive()}`} name="1y" onClick={this.activateButton}>1 Year</button>
        <button className={`btn btn-timeRange-5y ${this.is5yActive()}`} name="5y" onClick={this.activateButton}>5 Years</button>
      </div>

    );
  }

}

export default TimeRangeButtons;