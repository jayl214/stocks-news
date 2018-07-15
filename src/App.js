import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios'
import Chart from 'chart.js'
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

  //call iex api for all company names + tickers for use in search suggestions
  getCompanyTickersAndNames = () => {
    axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
      .then( (response) => {
        this.setState({companyTickersAndNames:response.data})
        console.log(this.state.companyTickersAndNames);
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
    const inputValue = input.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : companyList.filter(company =>
      company.name.toLowerCase().includes(inputValue)
    );
  }
  //takes in search input, returns array of 5 items or less that match search criteria
  searchbarSearch = (event) => {
    const input = event.target.value
    let searchbarSuggestions = this.searchbarSuggestionsGenerator(input, this.state.companyTickersAndNames)
    searchbarSuggestions.length = 5
    this.setState({searchbarSuggestions:searchbarSuggestions})
  }

    axios.get(`https://api.iextrading.com/1.0/stock/${ticker}/chart/${timeRange}`)
      .then( (response) => {
        let stockValues = []
        let dates = []
        response.data.forEach((day) => {
          dates.push(day.date)
          stockValues.push(day.close)
        })
        this.destroyPreviousChart()
        const ctx = document.getElementById('stockChart')
        const chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: dates,
                datasets: [{
                    label: name,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: stockValues,
                }]
            },

            // Configuration options go here
            options: {}
        })
        this.setState({chartInstance: chart})
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

  selectSuggestion = (event) => {
    let targetTicker = event.target.getAttribute("ticker")
    let targetName = event.target.getAttribute("name")
    this.setState(
      {
        "targetTicker": targetTicker,
    )
  }

  selectTimeRange = (event) => {
    let timeRange = event.target.getAttribute("name")
    this.setState(
      {
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
