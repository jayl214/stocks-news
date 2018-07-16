import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios' //promise based ajax
import Fuse from 'fuse.js' //fuzzy searcher
import Chart from 'chart.js' //duh
import './App.css';

//React components
import Searchbar from './Searchbar.jsx'
import Graph from './Graph.jsx'
import TimeRangeButtons from './TimeRangeButtons.jsx'

class App extends Component {

  state = {
    companyTickersAndNames: [],
    searchbarSuggestions: [],
    selectedCompany: {},
    targetTicker: '',
    targetName: '',
    timeRange: '1m',
    // chartInstance: {},
  }

  componentDidMount() {
    this.getCompanyTickersAndNames()
  }

// KLCN8GJ6VQQYF8DS

  //call iex api for all company names + tickers for use in search suggestions
  getCompanyTickersAndNames = () => {
    axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
      .then( (response) => {
        this.setState({companyTickersAndNames:response.data})
      })
      .catch( (error) => {
        // handle error
        console.log(error);
      })
      .then( () =>{
        // always executed
      })
  }
  //takes in an input string and the array of all company names, returns an array with only companies whose names include the searched string
  searchbarSuggestionsGenerator = (input, companyList) => {
    const fuseOptions = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "name",
        "symbol"
      ]
    }
    const fuse = new Fuse(companyList, fuseOptions); // "list" is the item array
    return fuse.search(input)
  }
  //takes in search input, returns array of 5 items or less that match search criteria
  searchbarSearch = (event) => {
    const input = event.target.value
    let searchbarSuggestions = this.searchbarSuggestionsGenerator(input, this.state.companyTickersAndNames)
    searchbarSuggestions.length = 5
    this.setState({searchbarSuggestions:searchbarSuggestions})
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

  destroyPreviousChart = () => {
    if (this.state.chartInstance) {
      this.state.chartInstance.destroy()
    }
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
            }]
        },
        // Configuration options go here
        options: {
          onClick: function (event){
            let clickedPoint = this.getElementsAtEvent(event)
            let clickedPointIndex
            let clickedPointDate
            if (clickedPoint.length > 0){
              clickedPointIndex = clickedPoint[0]._index
              clickedPointDate = dates[clickedPointIndex]
            }
            axios.get(`https://newsapi.org/v2/everything?q=${appjs.state.targetName}&from=${clickedPointDate}&to=${clickedPointDate}&sortBy=popularity&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`)
              .then( (response) => {
                // this.setState({companyTickersAndNames:response.data})
                console.log(appjs.state.targetName)
                console.log(response)

              //   const fuseOptions = {
              //   shouldSort: true,
              //   // threshold: .99,
              //   location: 0,
              //   distance: 100,
              //   maxPatternLength: 32,
              //   minMatchCharLength: 1,
              //   keys: [
              //     "name",
              //     "symbol"
              //   ]
              // }
              // const fuse = new Fuse(companyList, fuseOptions); // "list" is the item array
              // return fuse.search(input)


              })
              .catch( (error) => {
                // handle error
                console.log(error);
              })
              .then( () =>{
                // always executed
              })
          }
        }
    })
    //keep instance of chart in state so can access in other functions (deleting in destroyPreviousChart() )
    this.setState({chartInstance: chart})
  }

  selectSuggestion = (event) => {
    let targetTicker = event.target.getAttribute("ticker")
    let targetName = event.target.getAttribute("name")
    this.setState(
      {
        "targetTicker": targetTicker,
        "targetName": targetName
      }, this.chartNewData(targetTicker, targetName, this.state.timeRange)
    )
  }

  selectTimeRange = (event) => {
    let timeRange = event.target.getAttribute("name")
    this.setState(
      {
        timeRange: timeRange
      }, this.chartNewData(this.state.targetTicker, this.state.targetName, timeRange)
    )
  }




  render() {
    return (
      <div className="App">
        {/*<header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>*/}
        <p className="App-intro">
          Enter a company name
        </p>
        <Searchbar
          searchbarSearch = {this.searchbarSearch}
          searchbarSuggestions = {this.state.searchbarSuggestions}
          selectSuggestion = {this.selectSuggestion} />

        <TimeRangeButtons selectTimeRange = {this.selectTimeRange} />

        <Graph targetName = {this.state.targetName} />

      </div>
    )
  }
}

export default App;
