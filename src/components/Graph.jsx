import React, { Component } from 'react';

class Graph extends Component {

  render() {
    return (
      <div className = "chartContainer">
        <h2>{this.props.targetCompany.name}</h2>
        <canvas id="stockChart" width="100%" height="50vh"></canvas>
      </div>
    )
  }

}

export default Graph;