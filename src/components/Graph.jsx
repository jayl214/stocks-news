import React from 'react';

const Graph = ({companyName}) => {
  return (
    <div className = "chartContainer">
      <h2>{companyName}</h2>
      <div className = "chart-container">
        <canvas id="stockChart" width="100%" height="50vh"></canvas>
      </div>
    </div>
  )
}

export default Graph;