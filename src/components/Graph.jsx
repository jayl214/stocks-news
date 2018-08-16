import React, { Component } from 'react';
import Chart from 'chart.js' //duh
import axios from 'axios' //promise based ajax

// redux
import { connect } from "react-redux"
import { setChartInstance } from "../js/actions/index"

const mapDispatchToProps = dispatch => {
  return {
    setChartInstance: chartInstance => dispatch(setChartInstance(chartInstance))
  };
};

const mapStateToProps = state => {
  return {
    targetCompany: state.targetCompany,
    timeRange: state.timeRange,
  };
};

class ConnectedGraph extends Component {

  componentDidUpdate(){
    this.chartNewData(this.props.targetCompany.symbol, this.props.targetCompany.name, this.props.timeRange)
  }

  chartNewData = (ticker, name, timeRange) => {
    axios.get(`https://api.iextrading.com/1.0/stock/${ticker}/chart/${timeRange}`)
      .then( (response) => {
        console.log(response.data)
        let stockValues = []
        let dates = []
        response.data.forEach((day) => {
          dates.push(day.date)
          stockValues.push(day.close)
        })
        //need to destroy previous chart before making a new one, or will have bug where old graph pops up
        // this.destroyPreviousChart()
        this.generateChart(dates, name, stockValues)
      })
      .catch( (error) => {
        window.alert("Error retrieving stock data");
        console.log(error);
      })
  }


  generateChart = (dates, name, stockValues) => {
    let graphComponent = this //for calling React functions like setState in onClick
    const ctx = document.getElementById('stockChart')
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: dates,
            datasets: [{
                label: name,
                borderColor: 'rgba(255,236,0,1)',
                data: stockValues,
                radius: 0,
                pointHoverRadius : 5,
                lineTension:0
            }]
        },
        // Configuration options go here
        options: {
          onClick: function (event){
            let clickedPoint = this.getElementsAtXAxis(event)
            if (clickedPoint.length > 0){
              let clickedPointIndex = clickedPoint[0]._index
              let clickedPointDate = dates[clickedPointIndex]
              graphComponent.setNewsArticlesState(clickedPointDate)
            }
          },
          legend:{
            display:false,
          },
          hover:{
            mode: 'index',
            intersect: false,
          },
          tooltips:{
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(tooltipItem) {
                return graphComponent.props.targetCompany.symbol + ': ' + Number(tooltipItem.yLabel)+" Click to get news";
              }
            }
          },
          maintainAspectRatio: false,
        }
    })
    //keep instance of chart in state so can access in other functions (deleting in destroyPreviousChart() )
    this.props.setChartInstance(chart)
  }


  render() {
    return (
      <div className = "chartContainer">
        <h2>{this.props.targetCompany.name}</h2>
        <div className = "chart-container">
          <canvas id="stockChart" width="100%" height="50vh"></canvas>
        </div>
      </div>
    )
  }

}

const Graph = connect(mapStateToProps, mapDispatchToProps)(ConnectedGraph)
export default Graph;