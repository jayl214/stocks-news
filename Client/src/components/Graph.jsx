import React, { Component } from 'react';

class Graph extends Component {

  render() {
    return (
      <div className = "chartContainer">
        <h2>{this.props.targetCompany.name}</h2>
        <button onClick={this.props.addCompanyToPortfolio} >Add To Portfolio</button>
        <div className = "chart-container">
          <canvas id="stockChart" width="100%" height="50vh"></canvas>
        </div>
      </div>
    )
  }

}

export default Graph;