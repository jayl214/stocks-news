import Chart from 'chart.js' //duh
import axios from 'axios' //promise based ajax

import {SET_ALL_COMPANY_TICKERS_AND_NAMES} from '../constants/action-types'
import {SELECT_TARGET_COMPANY} from '../constants/action-types'
import {SET_CHART_INSTANCE} from '../constants/action-types'
import {SELECT_TIME_RANGE} from '../constants/action-types'

const initialState = {
  targetCompany:{
    name: '',
    symbol: ''
  },
  // articleList: [],
  companyTickersAndNames: [],
  chartInstance: {},
  timeRange: '1m',
}


// const generateChart = (dates, name, stockValues) => {
//     let graphComponent = this //for calling React functions like setState in onClick
//     const ctx = document.getElementById('stockChart')
//     const chart = new Chart(ctx, {
//         // The type of chart we want to create
//         type: 'line',

//         // The data for our dataset
//         data: {
//             labels: dates,
//             datasets: [{
//                 label: name,
//                 borderColor: 'rgba(255,236,0,1)',
//                 data: stockValues,
//                 radius: 0,
//                 pointHoverRadius : 5,
//                 lineTension:0
//             }]
//         },
//         // Configuration options go here
//         options: {
//           onClick: function (event){
//             let clickedPoint = this.getElementsAtXAxis(event)
//             if (clickedPoint.length > 0){
//               let clickedPointIndex = clickedPoint[0]._index
//               let clickedPointDate = dates[clickedPointIndex]
//               graphComponent.setNewsArticlesState(clickedPointDate)
//             }
//           },
//           legend:{
//             display:false,
//           },
//           hover:{
//             mode: 'index',
//             intersect: false,
//           },
//           tooltips:{
//             mode: 'index',
//             intersect: false,
//             callbacks: {
//               label: function(tooltipItem) {
//                 return graphComponent.props.targetCompany.symbol + ': ' + Number(tooltipItem.yLabel)+" Click to get news";
//               }
//             }
//           },
//           maintainAspectRatio: false,
//         }
//     })
//     //keep instance of chart in state so can access in other functions (deleting in destroyPreviousChart() )
//     this.props.setChartInstance(chart)
//   }


const rootReducer = (state=initialState, action) => {
  switch (action.type){
    case SET_ALL_COMPANY_TICKERS_AND_NAMES:
      return {...state, companyTickersAndNames: action.payload }
    case SELECT_TARGET_COMPANY:
      return {...state, targetCompany: action.payload }
    case SET_CHART_INSTANCE:
      return {...state, chartInstance: action.payload }
    case SELECT_TIME_RANGE:
      return {...state, timeRange: action.payload }
    default:
      return state
  }
}
export default rootReducer;