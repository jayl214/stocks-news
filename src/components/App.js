import React, { Component } from 'react';
import axios from 'axios' //promise based ajax
import Fuse from 'fuse.js' //fuzzy searcher
import Chart from 'chart.js' //duh
import '../styles/css/app.css';

//React components
import Searchbar from './Searchbar.jsx'
import Graph from './Graph.jsx'
import TimeRangeButtons from './TimeRangeButtons.jsx'
import ArticleList from './ArticleList.jsx'

class App extends Component {

  state = {
    targetCompany:{
      name: '',
      ticker: ''
    },
    targetTicker: '',
    targetName: '',
    timeRange: '1m',
    articleList: [],
    appjs: this
    // chartInstance: {},
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
        this.destroyPreviousChart()
        this.generateChart(dates, name, stockValues)
      })
      .catch( (error) => {
        // handle error
        console.log(error);
      })
      .then( () =>{
        // always executed
      })
  }

  //selects instance of chart at id.= stockChart and utterly destroys it
  destroyPreviousChart = () => {
    if (this.state.chartInstance) {
      this.state.chartInstance.destroy()
    }
  }

  sortNewsArticles = (allArticles, searchParameters) =>{
    const fuseOptions = {
      shouldSort: true,
      // threshold: .99,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "title",
        "description"
      ]
    }
    const fuse = new Fuse(allArticles, fuseOptions); // "list" is the item array
    return fuse.search(searchParameters)
  }

  setNewsArticlesState = (clickedPointDate) => {
    axios.get(`https://newsapi.org/v2/everything?q=${this.state.targetCompany.name}&from=${clickedPointDate}&to=${clickedPointDate}&sortBy=popularity&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`)
      .then( (response) => {
        this.setState({articleList:this.sortNewsArticles(response.data.articles, this.state.targetCompany.name)})
      })
      .catch( (error) => {
        // handle error
        console.log(error);
      })
      .then( () =>{
        // always executed
      })
  }

  generateChart = (dates, name, stockValues) => {
    let appjs = this //for calling React functions like setState in onClick
    const ctx = document.getElementById('stockChart')
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: dates,
            datasets: [{
                label: name,
                // backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: stockValues,
                radius: 0,
            }]
        },
        // Configuration options go here
        options: {
          onClick: function (event){
            let clickedPoint = this.getElementsAtXAxis(event)
            let clickedPointIndex
            let clickedPointDate
            if (clickedPoint.length > 0){
              clickedPointIndex = clickedPoint[0]._index
              clickedPointDate = dates[clickedPointIndex]
            }
            appjs.setNewsArticlesState(clickedPointDate)
          },
          onHover: function(event){
            let hoverPoint = this.getElementsAtXAxis(event)
          },
          legend:{
            display:false
          },
        }
    })
    //keep instance of chart in state so can access in other functions (deleting in destroyPreviousChart() )
    this.setState({chartInstance: chart})
  }

  selectTargetCompany = (event) => {
    let targetTicker = event.target.getAttribute("ticker")
    let targetName = event.target.getAttribute("name")
    this.setState(
      {
        targetCompany:{
          name: targetName,
          ticker: targetTicker
        },
        searchbarSuggestions: [],
      }, this.chartNewData(targetTicker, targetName, this.state.timeRange)
    )
  }

  selectTimeRange = (event) => {
    let timeRange = event.target.getAttribute("name")
    this.setState(
      {
        timeRange: timeRange
      }, this.chartNewData(this.state.targetCompany.ticker, this.state.targetCompany.name, timeRange)
    )
  }

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-intro">
            Search a Company
          </h1>
          <Searchbar selectTargetCompany = {this.selectTargetCompany} />
        </header>

        <TimeRangeButtons selectTimeRange = {this.selectTimeRange} timeRange = {this.state.timeRange} />
        <Graph targetCompany = {this.state.targetCompany} />

        <ArticleList articleList = {this.state.articleList} />
      </div>
    )
  }
}

export default App;
